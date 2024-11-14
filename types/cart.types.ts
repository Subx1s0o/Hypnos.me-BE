type CartItemOriginal = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    media?: { main: { url: string } };
  };
};

type CartItemCleaned = {
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    media?: { main: { url: string } };
  };
};

export type CartOriginal = {
  id: string;
  userId: string;
  items: CartItemOriginal[];
};

export type CartCleaned = {
  items: CartItemCleaned[];
};
