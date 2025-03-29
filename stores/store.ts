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
    }),
    actions: {
        setUserId(userId: string) {
            this.userId = userId;
        },
        clearUserId() {
            this.userId = "";
        },
    },
    getters: {
        getUserId: (state) => state.userId,
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

            const timeoutDuration = type === "addToCart" ? 2000 : 3000;
            
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
