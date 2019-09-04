const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    const item = await ctx.db.mutation.createItem({ data: { ...args } }, info);

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
};

module.exports = Mutations;
