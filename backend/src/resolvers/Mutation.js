const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { setCookie, hasPermission } = require('../utils');
const { makeANiceEmail, transport } = require('../mail');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const item = await ctx.db.mutation.createItem(
      // creating relationship between user and item
      { data: { ...args, user: { connect: { id: ctx.request.userId } } } },
      info,
    );

    return item;
  },
  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const { id, ...updates } = args;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id },
      },
      info,
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`);

    // 2. check if they own that item, or have the permission
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADMIN', 'ITEMDELETE'].includes(permission),
    );

    if (!ownsItem || !hasPermissions) {
      throw new Error(`You don't have permission to do that`);
    }

    // 3. delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // lowercase the email
    args.email = args.email.toLowerCase();

    // hash the password
    const password = await bcrypt.hash(args.password, 10);

    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info,
    );

    // create the JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // set jwt as a cookie on the response
    setCookie(ctx, token);

    return user;
  },
  async signin(parent, { email, password }, ctx) {
    // check if there is user with that email
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid password!`);
    }

    // generate jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // set the cookie with the token
    setCookie(ctx, token);

    // return the user
    return user;
  },
  signout(parent, args, ctx) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
  async requestReset(parent, { email }, ctx) {
    // check if this is a real user
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // set a reset token and expire on that user
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 36000000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // email them that reset token
    const mailResponse = await transport.sendMail({
      from: 'kuhelbeher@gmail.com',
      to: user.email,
      subject: 'Your Password Reset',
      html: makeANiceEmail(`Your Password Reset Token is here
      
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>
      `),
    });

    // return the message
    return { message: 'Thanks' };
  },
  async resetPassword(parent, args, ctx) {
    // check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error(`Your passwords don't match!`);
    }

    // check if its a legit reset token
    // check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });

    if (!user) {
      throw new Error(`This token is either invalid or expired!`);
    }

    // hash their new password
    const password = await bcrypt.hash(args.password, 10);

    // save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // generate jwt
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // set the jwt cookie
    setCookie(ctx, token);

    // return the new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    // query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info,
    );

    // check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

    // update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: { id: args.userId },
      },
      info,
    );
  },
};

module.exports = Mutations;
