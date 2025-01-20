export default defineNuxtConfig({
    modules: [
        "@nuxtjs/apollo",
        "@unocss/nuxt",
        [
            "@pinia/nuxt",
            {
                autoImport: ["defineStore", "acceptHMRUpdate"],
                storesDirs: ["stores"],
            },
        ],
        "pinia-plugin-persistedstate/nuxt",
        [
            "@nuxtjs/google-fonts",
            {
                families: {
                    Assistant: {
                        wght: [400, 600, 700],
                    },
                },
                display: "swap",
                prefetch: true,
                preconnect: true,
                preload: true,
                base64: false,
            },
        ],
    ],

    imports: {
        dirs: ["composables"],
    },

    devtools: {
        enabled: false,
    },

    runtimeConfig: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        public: {
            API_URL: process.env.API_URL,
            STRIPE_KEY: process.env.STRIPE_KEY,
        },
    },

    css: ["@unocss/reset/tailwind.css"],

    apollo: {
        clients: {
            default: {
                httpEndpoint: "https://mock.shop/api",
            },
        },
    },

    unocss: {
        rules: [
            [
                "grid-layout-main",
                {
                    "grid-template-rows": "min-content 1fr min-content",
                },
            ],
        ],
        safelist: ["overflow-y-scroll"],
    },

    app: {
        head: {
            title: "Together As One Storefront",
            link: [
                {
                    rel: "icon",
                    href: "/TA1.svg",
                },
            ],
            meta: [
                {
                    name: "description",
                    content: "Together As One Storefront Description",
                },
                {
                    name: "keywords",
                    content: "ecommerce, Together As One, storefront, online shopping",
                },
                {
                    property: "og:image",
                    content: "/og-image.jpg",
                },
                {
                    property: "og:title",
                    content: "Together As One Storefront",
                },
            ],
            htmlAttrs: {
                lang: "en",
            },
            bodyAttrs: {
                class: "overflow-y-scroll",
            },
        },
    },

    compatibilityDate: "2024-12-11",
});
