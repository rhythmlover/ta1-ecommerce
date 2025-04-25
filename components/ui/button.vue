<template>
    <component
        class="relative inline-flex cursor-pointer justify-center items-center select-none gap-2 whitespace-nowrap p-2 font-500 outline-none ring-slate-200 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
        :class="[variants[variant]]"
        :is="to ? NuxtLink : 'button'"
        :disabled="disabled || loading"
        :to="to"
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { type Component } from "vue";

type Variant = "primary" | "outline" | "highlight" | "text" | "changeQty";

withDefaults(
    defineProps<{
        as?: string | Component;
        variant?: Variant;
        loading?: boolean;
        disabled?: boolean;
        to?: string;
    }>(),
    {
        as: "button",
        variant: "primary",
        loading: false,
        disabled: false,
    }
);

const variants: Record<Variant, string> = {
    "primary":
        "text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:from-indigo-400 active:to-indigo-300 svg:stroke-white rounded-md",
    "outline": "bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-md",
    "highlight":
        "bg-white text-indigo-500 hover:bg-slate-50 active:bg-slate-100 border border-indigo-500 rounded-md",
    "text": "hover:bg-slate-100 rounded-full",
    "changeQty": "hover:bg-slate-100 rounded-lg" // just for the increment and decrement buttons
};
</script>   
