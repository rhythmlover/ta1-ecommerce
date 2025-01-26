<template>
    <header
        class="flex items-center justify-between p-4 gap-4 bg-white border-b border-slate-200 z-50 md:px-10 lg:px-50 xl:px-80 2xl:px-100">
        <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden ml-2" aria-label="Toggle menu">
            <IconMenu2 width="28" height="28" />
        </button>

        <div class="flex items-center gap-4 lg:flex-1">
            <UiLogo class="lg:hidden ml-10" />
            <UiBrand class="max-lg:hidden lg:mr-4" />

            <div class="hidden lg:flex items-center gap-4">
                <hr class="w-px h-6 border-none bg-slate-200" />
                <UiLink class="text-sm hover:underline" to="/"> Explore </UiLink>
                <UiLink class="text-sm hover:underline" to="/contact"> Contact </UiLink>
                <UiLink class="text-sm hover:underline" to="/faq"> FAQ </UiLink>
            </div>
        </div>

        <div>
            <UiButton v-if="!userLoggedIn" variant="text" class="text-sm" aria-label="Login" to="/login">
                <IconLogin width="22" height="22" />
            </UiButton>
            <Menu v-else as="div" class="relative inline-block text-left pr-2">
                <MenuButton>
                    <IconUser width="22" height="22" />
                </MenuButton>

                <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems
                        class="absolute right-0 z-10 mt-2 w-30 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div class="py-1">
                            <MenuItem v-slot="{ active }">
                            <button @click="logout"
                                :class="[active ? 'bg-gray-100 text-red-900 outline-none' : 'text-red-700', 'block w-full px-4 py-2 text-left text-sm']">Sign out</button>
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
                <button @click="isMenuOpen = false" class="text-black-400 hover:text-white">
                    <IconX width="28" height="28" />
                </button>
                <UiLogo class="mx-auto" />
                <div class="w-[22px]"></div> <!-- Spacer for centering logo -->
            </div>

            <div class="flex flex-col p-4 space-y-1">
                <UiLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
                    class="text-black-300 hover:text-white text-base py-2 transition-colors duration-200"
                    @click="isMenuOpen = false">
                    {{ item.name }}
                    <hr class="h-2px mt-2 border-none bg-slate-200" />
                </UiLink>
            </div>
        </nav>
    </transition>

    <div class="flex flex-col">
        <slot />
    </div>

    <footer class="flex flex-col border-t border-slate-200">
        <div class="flex flex-col items-start gap-8 md:gap-12 md:flex-row mx-auto w-full max-w-6xl p-8">
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
import { IconLogin, IconMenu2, IconShoppingBag, IconUser, IconX } from "@tabler/icons-vue";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

const isMenuOpen = ref(false);
const cartStore = useCartStore();
const userStore = useUserStore();
const cartQuantity = computed(() => cartStore.getCartQty);
const userLoggedIn = computed(() => userStore.getUserId !== '');

const navigationItems = [
    { name: 'Explore', path: '/' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
]

onMounted(() => {
    if (!userLoggedIn.value) {
        cartStore.clearCartQty();
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
    navigateTo("/");
}
</script>
