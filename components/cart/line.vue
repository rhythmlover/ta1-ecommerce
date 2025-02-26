<template>
    <div class="flex items-start gap-6">
        <NuxtImg 
            :src="modelValue.option.imageUrl + '.jpg'" 
            :alt="modelValue.product.name" 
            :modifiers="{ roundCorner: '10:10' }" 
            layout="responsive" 
            width="180" 
            height="180" 
        />

        <div class="flex flex-col items-start gap-2">
            <UiLink class="text-xl" :to="productUrl">
                {{ modelValue.product.name }}
            </UiLink>

            <!-- <strong class="font-semibold">
                <UiPrice :model-value="modelValue.cost.totalAmount" />
            </strong> -->

            <strong class="font-semibold">
                <span>${{ accumulatedPrice.toFixed(2) }}</span>
            </strong>

            <div class="flex flex-col text-sm">
                <UiParagraph>Option: {{ modelValue.option.name }}</UiParagraph>
            </div>

            <div class="flex gap-2 flex-wrap">
                <UiButton variant="outline" aria-label="Delete Line Item" @click="deleteLineItem">
                    <IconTrash width="20" height="20" />
                </UiButton>

                <div class="flex items-center border border-slate-200 rounded-lg">
                    <UiButton variant="text" aria-label="Increase Product Quantity" @click="updateQuantity(-1)">
                        <IconMinus width="20" height="20" />
                    </UiButton>

                    <span class="text-sm px-4">
                        {{ quantity }}
                    </span>

                    <UiButton variant="text" aria-label="Decrease Product Quantity" @click="updateQuantity(1)">
                        <IconPlus width="20" height="20" />
                    </UiButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-vue";
import { updateCartItemQuantity, deleteCartItem } from "~/composables/endpoints";
import type { CartItem } from "~/types/types";

const props = defineProps<{
    modelValue: CartItem;
}>();

const productUrl = `/products/${props.modelValue.product.handle}?id=${props.modelValue.product.id}`;
const emit = defineEmits(['update:modelValue', 'delete:item']);
const quantity = ref(props.modelValue.quantity);
const accumulatedPrice = ref(props.modelValue.product.price * quantity.value);

watch(quantity, async (newQuantity) => {
    accumulatedPrice.value = props.modelValue.product.price * newQuantity;
    await updateCartItemQuantity(props.modelValue.id, newQuantity);
    emit('update:modelValue', { ...props.modelValue, quantity: newQuantity });
});

function updateQuantity(change: number) {
    const newQuantity = quantity.value + change;
    if (newQuantity > 0) {
        quantity.value = newQuantity;
    }
}

async function deleteLineItem() {
    await deleteCartItem(props.modelValue.id);
    emit('delete:item', props.modelValue.id);
}
</script>
