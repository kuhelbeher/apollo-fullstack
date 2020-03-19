export enum Permissions {
  Admin = 'ADMIN',
  User = 'USER',
  ItemCreate = 'ITEMCREATE',
  ItemUpdate = 'ITEMUPDATE',
  ItemDelete = 'ITEMDELETE',
  PermissionUpdate = 'PERMISSIONUPDATE',
}

export type Item = {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
};

export type Cart = Array<{
  id: string;
  quantity: number;
  item: Item;
}>;
