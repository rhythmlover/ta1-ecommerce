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

                        - However, this site shall not be held responsible for any loss or damage that occurs after
                        delivery has been completed.<br><br>

                        [Delivery time]<br>
                        - Shipping takes place Monday to Friday, excluding holidays and weekends.<br>
                        - Typically, orders are processed and shipped within 2-3 business days.<br>
                        - We ship all our products via SingPost.</p>
                </div>
            </details>
            <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">Payment Methods</summary>
                <div class="px-4 pb-4">
                    <p>We currently accept credit cards, debit cards and PayNow payment methods.</p>
                </div>
            </details>
            <!-- <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">How long does shipping take?
                </summary>
                <div class="px-4 pb-4">
                    <p>Shipping times may vary depending on your location and the shipping method chosen.
                        Typically, orders are processed within 1-2 business days, and delivery can take 3-7
                        business days within Singapore.</p>
                </div>
            </details> -->
            <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">Returns, Exchanges due to product defects</summary>
                <div class="px-4 pb-4">
                    <p>Yes, we have a hassle-free return policy. If there is a defect in the product you received,
                        you can initiate a return within 30 days of receiving the product. Please contact our
                        customer support at <a href="" class="underline">example@gmail.com</a> for assistance.
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
            <!-- <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">What is your customer support
                    contact?</summary>
                <div class="px-4 pb-4">
                    <p>If you have any questions, concerns, or need assistance, you can reach our customer
                        support team at 9911083755 during our business hours, Monday to Saturday from 10 am to 6
                        pm. You can also contact us via email at <a href="" class="underline">example@gmail.com</a>.
                    </p>
                </div>
            </details>
            <details>
                <summary class="py-2 outline-none cursor-pointer focus:underline">What are your terms and
                    conditions?</summary>
                <div class="px-4 pb-4">
                    <p>You can find our detailed terms and conditions by visiting our
                        <a href="" class="underline">Terms of Service</a>
                        page on our website. It includes information about our policies, user guidelines, and
                        more.
                    </p>
                </div>
            </details> -->
        </div>
    </UiCenter>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const openSection = ref<string | null>(null)

const toggleSection = (section: string) => {
    openSection.value = openSection.value === section ? null : section
}
</script>