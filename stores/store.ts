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

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
