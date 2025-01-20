<template>
    <div>
        <input :value="modelValue" @input="updateValue" :type="type" :placeholder="placeholder"
        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue?: string;
    type?: string;
    placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target) {
        emit('update:modelValue', target.value);
    }
};
</script>