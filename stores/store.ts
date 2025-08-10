import { acceptHMRUpdate, defineStore } from "pinia";

export const useCartStore = defineStore("cart-store", {
    state: () => ({
        cartQty: 0,
    }),
    actions: {
        incrementCartQty() {
            this.cartQty++;
        },
        decrementCartQty() {
            this.cartQty--;
        },
        setCartQty(qty: number) {
            this.cartQty = qty;
        },
        clearCartQty() {
            this.cartQty = 0;
        }
    },
    getters: {
        getCartQty: (state) => state.cartQty,
    },
    persist: true,
});

export const useUserStore = defineStore("user-store", {
    state: () => ({
        userId: '',
        isGuest: false,
        sessionId: '',
    }),
    actions: {
        setUserId(userId: string) {
            this.userId = userId;
            this.isGuest = false; // When setting a real user ID, they're not a guest
        },
        clearUserId() {
            this.userId = "";
            this.isGuest = false;
        },
        setSessionId(sessionId: string) {
            this.sessionId = sessionId;
            this.isGuest = true; // When setting session ID, mark as guest
        },
        clearSession() {
            this.sessionId = "";
            this.isGuest = false;
        },
    },
    getters: {
        getUserId: (state) => state.userId,
        getIsGuest: (state) => state.isGuest,
        getSessionId: (state) => state.sessionId,
        isLoggedIn: (state) => state.userId !== '' && !state.isGuest,
    },
    persist: true,
});

export const useAlertStore = defineStore("alert-store", {
    state: () => ({
        alert: {
            show: false,
            message: "",
            type: "success",
        },
        timeoutId: null as ReturnType<typeof setTimeout> | null,
    }),
    actions: {
        showAlert(message: string, type: "success" | "error" | "addToCart") {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }

            this.alert = {
                show: true,
                message,
                type,
            };

            const timeoutDuration = type === "addToCart" ? 2000 : 5000;
            
            this.timeoutId = setTimeout(() => {
                this.clearAlert();
            }, timeoutDuration);
        },
        clearAlert() {
            this.alert = {
                show: false,
                message: "",
                type: "success",
            };
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        },
    },
    getters: {
        getAlert: (state) => state.alert,
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
