export type ReceiptData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    purchaseDate: string;
    purchaseDateAndTime: string;
    paymentMethod: string;
    paymentDate: string;
    receiptId: string;
    totalCost: number;
    receiptItems: ReceiptItem[];
};

export type ReceiptItem = {
    description: string;
    quantity: number;
    price: number;
};