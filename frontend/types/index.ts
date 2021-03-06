export type User = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  cart: CartItem[];
};

export type Item = {
  id: string;
  title: string;
  price: number;
  image: string;
  largeImage: string;
  description: string;
};

export type CartItem = {
  id: string;
  quantity: number;
  item: Item;
};

export type OrderItem = Item & {
  quantity: number;
};

export type Order = {
  id: string;
  charge: string;
  total: number;
  createdAt: string;
  user: {
    id: string;
  };
  items: OrderItem[];
};
