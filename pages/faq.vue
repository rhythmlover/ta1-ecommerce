<template>
    <UiCenter>
        <UiHeading class="mx-auto"> Frequently Asked Questions </UiHeading>
        <div class="flex flex-col divide-y py-10 sm:px-8 lg:px-12 xl:px-32 divide-gray-700">
            <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">Delivery Information
                </summary>
                <div class="px-4 pb-4">
                    <p>[Shipping fee] <br>
                        Standard: Free <br>
                        - We ship all our products via SingPost.<br>
                        - This site shall not be held responsible for any loss or damage that occurs after
                        delivery has been completed.<br><br>

                        [Delivery time]<br>
                        - Shipping takes place between Monday to Friday, excluding holidays and weekends.<br>
                        - Typically, orders are processed and shipped within 2-3 business days.<br>
                    </p>
                </div>
            </details>
            <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">Payment Methods</summary>
                <div class="px-4 pb-4">
                    <p>We currently accept credit cards, debit cards and PayNow payment methods.</p>
                </div>
            </details>
            <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">Returns, Exchanges due to product defects</summary>
                <div class="px-4 pb-4">
                    <p>Yes, we have a hassle-free return policy. If there is a defect in the product you received,
                        you can initiate a return within 30 days of receiving the product. Please contact our
                        customer support at <span class="underline">example@gmail.com</span> for assistance.
                    </p>
                </div>
            </details>
            <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">Do you offer international
                    shipping?</summary>
                <div class="px-4 pb-4">
                    <p>Currently, we only provide shipping services within Singapore.</p>
                </div>
            </details>
        </div>
    </UiCenter>
</template>

<script lang="ts" setup>
useSeoMeta({
    title: "FAQ - Together as One Store",
});
</script>