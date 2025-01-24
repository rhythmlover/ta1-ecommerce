import type { Product, Cart, User, Order } from "~/types/types";
import Stripe from "stripe";

export async function getAllProducts(): Promise<Product[]> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/products/get-all`);
    const products = await response.json();

    return products;
}

export async function getProduct(id: string): Promise<Product> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/products/get/${id}`);
    const product = await response.json();

    return product;
}

export async function userLogin(email: string, password: string): Promise<User> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    const userData = await response.json();
    if (userData.statusCode === 403){
        console.error(userData.message);
    }
    return userData;
}

export async function userSignup(email: string, password: string): Promise<{ message: string, error: string, statusCode: number }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    const userData = await response.json();
    return userData;
}

export async function getUserCart(userId: string): Promise<Cart | null> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/cart/get/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user cart');
    }

    const text = await response.text();
    if (!text) {
        return null;
    }

    const cart = JSON.parse(text);
    return cart;
}

export async function createCart(userId: string): Promise<Cart> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/cart/create/${userId}`, {
        method: "POST",
    });

    return await response.json();
}

export async function deleteCartItem(id: string): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/cart/delete-item/${id}`, {
        method: "DELETE",
    });

    return await response.json();
}

export async function updateCartItemQuantity(id: string, quantity: number): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/cart/update-item/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
    });

    return await response.json();
}

export async function addItemToUserCart(
    cartId: string,
    productId: string,
    optionId: string,
    quantity: number
): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/cart/add-item`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId, productId, optionId, quantity }),
    });

    return await response.json();
}

export async function updateTotalCost(cartId: string, totalCost: number): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/cart/update-total-cost/${cartId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalCost }),
    });

    return await response.json();
}

export async function createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/payment/create-payment-intent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
    });

    return await response.json();
}

export async function clearCart(cartId: string): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/cart/clear-cart/${cartId}`, {
        method: "GET",
    });

    return await response.json();
}

export async function sendEmailAfterPayment(email: string): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/payment/send-email-after-payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    return await response.json();
}

export async function createOrder(orderInfo: Order): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            paymentId: orderInfo.paymentId,
            userId: orderInfo.userId,
            totalCost: orderInfo.totalCost,
            name: orderInfo.name,
            email: orderInfo.email,
            phone: orderInfo.phone,
            address: orderInfo.address,
            postalCode: orderInfo.postalCode,
            items: orderInfo.items,
        }),
    });

    return await response.json();
}

export async function getOrder(paymentId: string): Promise<Order> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/get/${paymentId}`);
    const order = await response.json();

    return order;
}

export async function getOrderId(paymentId: string): Promise<{ id: string }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/get-order-id/${paymentId}`);
    const order = await response.json();

    return order;
}

export async function getOrderTimestamp(paymentId: string): Promise<{ createdAt: string }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/get-order-timestamp/${paymentId}`);
    const order = await response.json();

    return order;
}

export async function requestPasswordReset(email: string): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/request-password-reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    return await response.json();
}

export async function verifyPasswordReset(id: string): Promise<{ message: string }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/verify-reset-password/${id}`, {
        method: "POST",
    });

    return await response.json();
}

export async function resetPassword(dto: { email: string, password: string }, id: string): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dto, id }),
    });

    return await response.json();
}

export async function sendInquiryEmail(name: string, email: string, message: string, orderNo: string): Promise<{ message: string }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/misc/send-inquiry-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, orderNo }),
    });

    return await response.json();
}


