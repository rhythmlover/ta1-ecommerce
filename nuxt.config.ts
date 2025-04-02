export default defineNuxtConfig({
    modules: [
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
        '@nuxt/image',
    ],

    image: {
        provider: 'cloudinary',
        cloudinary: {
            baseURL: 'https://res.cloudinary.com/dtqcqe0iu/image/upload/v1738608759/',
            modifiers: {
                effect: 'sharpen:100',
                quality: 'auto:best',
            },
        }
    },

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
            WEB_URL: process.env.WEB_URL,
            STRIPE_KEY: process.env.STRIPE_KEY,
        },
    },

    css: ["@unocss/reset/tailwind.css"],

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
                    type: "image/png",
                    href: "/TA1.png",
                },
            ],
            meta: [
                {
                    name: "description",
                    content: "Discover the latest TA1 products and collections.",
                },
                {
                    name: "keywords",
                    content: "ecommerce, Together As One, storefront, online shopping",
                },
                {
                    property: "og:image",
                    content: "/TA1.png",
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

    compatibilityDate: "2025-03-28",
});