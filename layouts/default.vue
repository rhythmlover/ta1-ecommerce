<template>
    <header
        class="flex items-center justify-between p-4 gap-4 bg-white border-b border-slate-200 z-50 lg:px-10 xl:px-50 2xl:px-100">
        <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden ml-2" aria-label="Toggle menu">
            <IconMenu2 width="28" height="28" />
        </button>

        <div class="flex items-center gap-4 lg:flex-1">
            <UiLogo class="lg:hidden ml-10" />
            <UiBrand class="max-lg:hidden lg:mr-4" />

            <div class="hidden lg:flex items-center gap-4">
                <hr class="w-px h-6 border-none bg-slate-200" />
                <UiLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
                    class="text-sm font-mono hover:underline">
                    {{ item.name }}
                </UiLink>
            </div>
        </div>

        <div>
            <UiButton v-if="!userLoggedIn" variant="text" class="text-sm" aria-label="Login" to="/login">
                <IconLogin2 width="22" height="22" />
            </UiButton>
            <Menu v-else as="div" class="relative inline-block text-left">
                <MenuButton class="hover:bg-slate-50 active:bg-slate-100 p-2 rounded-md">
                    <IconUser width="22" height="22" />
                </MenuButton>

                <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems
                        class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div>
                            <MenuItem v-if="isAdmin" v-slot="{ active }">
                            <button @click="goToOrderBacklog"
                                :class="[active ? 'bg-#FFF0F5 text-#B57EDC outline-none rounded-md' : 'text-#B57EDC bg-#E6E6FA rounded-t-md', 'block w-full px-4 py-2 text-left text-sm']">Order
                                Backlog</button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                            <button @click="goToOrderHistory"
                                :class="[active ? 'bg-gray-100 text-black-900 outline-none rounded-md' : 'text-black-900', 'block w-full px-4 py-2 text-left text-sm']">Order
                                History</button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                            <button @click="logout"
                                :class="[active ? 'bg-gray-100 text-#FF0000 outline-none rounded-md' : 'text-#FF0000', 'block w-full px-4 py-2 text-left text-sm']">Sign
                                out</button>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </transition>
            </Menu>

            <UiButton variant="text" class="text-sm" aria-label="Shopping Cart" @click="checkIfUserIsLoggedIn">
                <IconShoppingBag width="22" height="22" />
                <span v-if="cartQuantity > 0"
                    class="absolute bottom-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white-100 bg-indigo rounded-full">
                    {{ cartQuantity }}</span>
            </UiButton>
        </div>
    </header>

    <div v-if="announcement" class="bg-[#685044] text-white text-center p-2">
        <p class="text-md">{{ announcement }}</p>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition enter-active-class="transition-opacity ease-out duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity ease-in duration-300"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isMenuOpen" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="isMenuOpen = false"></div>
    </transition>

    <!-- Mobile Menu Panel -->
    <transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0" leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
        <nav v-if="isMenuOpen" class="fixed top-0 left-0 bottom-0 w-[340px] bg-[#ffffff] z-50 lg:hidden flex flex-col">
            <div class="flex items-center justify-between p-4 border-b border-gray-700">
                <button @click="isMenuOpen = false" class="text-black-400">
                    <IconX width="28" height="28" />
                </button>
                <UiLogo class="mx-auto" />
                <div class="w-[22px]"></div>
            </div>

            <div class="flex flex-col p-4 space-y-1">
                <UiLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
                    class="text-black-300 text-base py-2 transition-colors duration-200" @click="isMenuOpen = false">
                    {{ item.name }}
                </UiLink>
            </div>
        </nav>
    </transition>

    <div class="flex flex-col">
        <slot />
    </div>

    <footer class="flex flex-col border-t border-slate-200">
        <div class="flex flex-col items-start gap-8 md:gap-12 md:flex-row mx-auto w-full max-w-6xl p-8">
            <div class="flex flex-col gap-2">
                <h3 class="text-size-2xl font-extrabold mb-5">Help and Support</h3>
                <UiLink to="/contact" class="font-mono w-0">
                    Contact
                </UiLink>
                <UiLink to="/faq" class="font-mono w-0">
                    FAQ
                </UiLink>
                <UiLink to="/terms-conditions" class="font-mono w-40">
                    Terms and Conditions
                </UiLink>
                <UiLink to="/privacy-policy" class="font-mono w-25">
                    Privacy Policy
                </UiLink>
            </div>
        </div>

        <div
            class="flex gap-2 flex-col md:flex-row items-center justify-between text-sm font-semibold border-t border-slate-200 p-4">
            <UiButton variant="text" to="/">
                <span class="px-2"> {{ new Date().getFullYear() }} TOGETHER AS ONE </span>
            </UiButton>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { IconLogin2, IconMenu2, IconShoppingBag, IconUser, IconX } from "@tabler/icons-vue";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import type { Cart } from "~/types/types";

const cartStore = useCartStore();
const userStore = useUserStore();

const isAdmin = ref(false);
const isMenuOpen = ref(false);
const cartQuantity = computed(() => cartStore.getCartQty);
const userLoggedIn = computed(() => userStore.getUserId !== '');
const cartData = ref<Cart | null>(null);
const announcement = ref('');

const navigationItems = [
    { name: 'Explore', path: '/' },
]

onMounted(async () => {
    if (!userLoggedIn.value) {
        cartStore.clearCartQty();
    } else {
        cartData.value = await getUserCart(userStore.getUserId);
        cartStore.setCartQty(cartData.value?.items.length || 0);
        
        const userDetails = await getUserDetails(userStore.getUserId);
        console.log(userDetails);
        if (userDetails && userDetails.role === 'admin') {
            isAdmin.value = true;
        }
    }
    if ((await getAnnouncement()).content !== '') {
        announcement.value = (await getAnnouncement()).content;
    }
});

async function checkIfUserIsLoggedIn() {
    if (userLoggedIn.value) {
        navigateTo("/cart");
    } else {
        navigateTo("/login");
    }
}

async function logout() {
    cartStore.clearCartQty();
    userStore.clearUserId();
    window.location.href = '/';
}

async function goToOrderHistory() {
    navigateTo("/order-history");
}

async function goToOrderBacklog() {
    navigateTo("/order-backlog");
}
</script>
