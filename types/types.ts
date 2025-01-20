export type Option = {
    id: string;
    name: string;
    quantity: number;
    imageUrl: string;
    productId: string;
    product: Product;
    cartItems: CartItem[];
};

export type Product = {
    id: string;
    handle: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    options: Option[];
    collectionId?: string;
    collection?: Collection;
    cartItems: CartItem[];
};

export type Collection = {
    id: string;
    handle: string;
    title: string;
    description?: string;
    imageUrl: string;
    products: Product[];
};

export type CartItem = {
    id: string;
    quantity: number;
    optionId: string;
    option: Option;
    productId: string;
    product: Product;
    cartId: string;
    cart: Cart;
};

export type Cart = {
    id: string;
    userId: string;
    user: User;
    items: CartItem[];
    totalCost: number;
    createdAt: Date;
    updatedAt: Date;
};

export type User = {
    id: string;
    email: string;
    password: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
    carts: Cart[];
};

export type Order = {
    userId: string;
    paymentId: string;
    totalCost: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    items: OrderItem[];
};

export type OrderItem = {
    quantity: number;
    productId: string;
    optionId: string;
};