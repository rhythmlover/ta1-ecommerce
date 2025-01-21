<template>
    <header
        class="flex items-center justify-between p-4 gap-4 bg-white border-b border-slate-200 z-50 md:px-10 lg:px-50 xl:px-80 2xl:px-100">
        <div class="flex items-center gap-4">
            <UiBrand />

            <hr class="w-px h-6 border-none bg-slate-200" />

            <UiLink class="text-sm hover:underline" to="/"> Home </UiLink>
            <UiLink class="text-sm hover:underline" to="/contact"> Contact </UiLink>
            <UiLink class="text-sm hover:underline" to="/faq"> FAQ </UiLink>
        </div>

        <div>
            <UiButton v-if="!userLoggedIn" variant="text" class="text-sm" aria-label="Login" to="/login">
                <IconLogin width="22" height="22" />
            </UiButton>
            <Menu v-else as="div" class="relative inline-block text-left pr-2">
                <div>
                    <MenuButton>
                        <IconUser width="22" height="22" />
                    </MenuButton>
                </div>

                <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems
                        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div class="py-1">
                            <!-- <MenuItem v-slot="{ active }">
                            <a href="#"
                                :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']">Account
                                settings</a>
                            </MenuItem> -->
                            <MenuItem v-slot="{ active }">
                            <button @click="logout"
                                :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">Sign
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

    <div class="flex flex-col">
        <slot />
    </div>

    <footer class="flex flex-col border-t border-slate-200">
        <div class="flex flex-col items-start gap-8 md:gap-12 md:flex-row mx-auto w-full max-w-6xl p-8">
            <!-- <UiBrand /> -->

            <!-- <div class="flex flex-col gap-2">
                <UiLink :to="`/faq`">
                    FAQ
                </UiLink>
            </div> -->
        </div>

        <div
            class="flex gap-2 flex-col md:flex-row items-center justify-between text-sm font-semibold border-t border-slate-200 p-4">
            <UiButton variant="text" to="/">
                <span class="px-2"> © {{ new Date().getFullYear() }} TOGETHER AS ONE </span>
            </UiButton>

            <!-- <div class="flex gap-2">
                <UiButton
                    variant="outline"
                    target="_blank"
                    aria-label="GitHub"
                    to="https://github.com/moritzmla/nuxt-shopify-template"
                >
                    <IconBrandGithub width="20" height="20" />
                </UiButton>

                <UiButton target="_blank" to="https://moritzmla.com/">
                    <span class="px-2"> Created by Moritz Müller </span>
                </UiButton>
            </div> -->
        </div>
    </footer>
</template>

<script setup lang="ts">
import { IconLogin, IconShoppingBag, IconUser } from "@tabler/icons-vue";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

const cartStore = useCartStore();
const userStore = useUserStore();
const cartQuantity = computed(() => cartStore.getCartQty);
const userLoggedIn = computed(() => userStore.getUserId !== '');

async function checkIfUserIsLoggedIn() {
    if (userStore.getUserId !== '') {
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
