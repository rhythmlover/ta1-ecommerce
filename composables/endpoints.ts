import type { Product, Cart, User, Order } from "~/types/types";
import Stripe from "stripe";

export async function getAllProducts(): Promise<Product[]> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/products/get-all`);
    
    return await response.json();
}

export async function getProduct(id: string): Promise<Product> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/products/get/${id}`);
    
    return await response.json();
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
    try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.API_URL}/products/get-by-handle/${handle}`);

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function getUserDetails(id: string): Promise<User> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/get-user-details/${id}`);

    return await response.json();
}

export async function userLogin(email: string, password: string): Promise<User | { message: string, error: string, statusCode: number }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    
    const userData = await response.json();
    if (userData.statusCode === 403) {
        return { message: userData.message, error: userData.error, statusCode: userData.statusCode };
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

    return await response.json();
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

    return JSON.parse(text);
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

export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/payment/get-payment-intent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId }),
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

export async function getPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/payment/get-payment-method`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethodId }),
    });

    return await response.json();
}

export async function getCharge(chargeId: string): Promise<Stripe.Charge> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/payment/get-charge`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ chargeId }),
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

export async function getAllOrders(): Promise<Order[]> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/get-all`);
    
    return await response.json();
}

export async function updateOrderToFulfilled(orderId: string): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/update-order-fulfilled/${orderId}`, {
        method: "POST",
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
    
    return await response.json();
}

export async function getOrderId(paymentId: string): Promise<{ id: string }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/get-order-id/${paymentId}`);
    
    return await response.json();
}

export async function getOrderTimestamp(paymentId: string): Promise<{ createdAt: string }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/get-order-timestamp/${paymentId}`);
    
    return await response.json();
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/order/get-orders-by-user/${userId}`);
    
    return await response.json();
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

export async function requestEmailVerification(email: string): Promise<Response> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/request-email-verification/${email}`, {
        method: "POST",
    });

    return await response.json();
}

export async function verifyEmail(id: string, email: string): Promise<{ message: string }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email }),
    });

    return await response.json();
}

export async function getAnnouncement(): Promise<{ content: string }> {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.API_URL}/misc/get-announcement`);

    return await response.json();
}

