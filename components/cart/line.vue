<template>
    <div class="flex items-start gap-6">
        <NuxtImg :src="modelValue.option.imageUrl + '.jpg'" :alt="modelValue.product.name"
            :modifiers="{ roundCorner: '10:10' }" layout="responsive" width="180" height="180" class="shadow-md rounded-lg"/>

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

                <div class="flex bg-white items-center border border-slate-200 rounded-lg">
                    <UiButton variant="changeQty" aria-label="Increase Product Quantity" @click="changeQuantity(-1)">
                        <IconMinus width="20" height="20" />
                    </UiButton>

                    <input type="number" v-model.number="displayedQuantity"
                        class="w-8 text-center border-none outline-none text-sm [&::-webkit-inner-spin-button]:appearance-none"
                        :min="1" :max="10" @input="sanitizeQuantity" @blur="validateQuantity" @keydown.enter="submitQuantity" />

                    <UiButton variant="changeQty" aria-label="Decrease Product Quantity" @click="changeQuantity(1)">
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

const emit = defineEmits(['update:cartItem', 'delete:item', 'update:totalCost']);
const props = defineProps<{
    modelValue: CartItem;
}>();

const productUrl = `/products/${props.modelValue.product.handle}`;
const displayedQuantity = ref(0);
const quantity = ref(props.modelValue.quantity);
const accumulatedPrice = ref(props.modelValue.product.price * quantity.value);

const alertStore = useAlertStore();

onMounted(() => {
    alertStore.clearAlert();
    displayedQuantity.value = quantity.value;
});

watch(quantity, async (newQuantity) => {
    accumulatedPrice.value = props.modelValue.product.price * newQuantity;
    await updateCartItemQuantity(props.modelValue.id, newQuantity);
    emit('update:cartItem', { ...props.modelValue, quantity: newQuantity });
    emit('update:totalCost');
});

function changeQuantity(amount: number) {
    if (quantity.value + amount < 1) {
        alertStore.showAlert('Minimum purchase quantity is 1.', 'error');
        return;
    } else if (quantity.value + amount > 30) {
        alertStore.showAlert('You can only purchase a maximum quantity of 30.', 'error');
        return;
    }
    displayedQuantity.value += amount;
    quantity.value += amount;
}

function sanitizeQuantity(event: Event) {
    const input = event.target as HTMLInputElement;

    // Remove invalid characters (non-numeric, negative signs, plus signs)
    input.value = input.value.replace(/[^0-9]/g, '');

    // Prevent starting with 0
    if (input.value.startsWith('0')) {
        input.value = input.value.replace(/^0+/, "0");
    }

    // Allow the input to remain blank temporarily
    if (input.value === '') {
        quantity.value = 0;
        return;
    }

    displayedQuantity.value = parseInt(input.value, 10);
}

function validateQuantity() {
    if (!displayedQuantity.value || isNaN(displayedQuantity.value)) {
        displayedQuantity.value = 1;
        alertStore.showAlert('Please enter a quantity.', 'error');
    } else if (displayedQuantity.value < 1) {
        displayedQuantity.value = 1;
        alertStore.showAlert('Minimum purchase quantity is 1.', 'error');
    } else if (displayedQuantity.value > 30) {
        displayedQuantity.value = 30;
        alertStore.showAlert('You can only purchase a maximum quantity of 30.', 'error');
    }

    quantity.value = displayedQuantity.value;
}

function submitQuantity(event: KeyboardEvent) {
    validateQuantity();

    // Remove focus from the input field
    const input = event.target as HTMLInputElement;
    input.blur();
}

async function deleteLineItem() {
    await deleteCartItem(props.modelValue.id);
    emit('delete:item', props.modelValue.id);
}
</script>
