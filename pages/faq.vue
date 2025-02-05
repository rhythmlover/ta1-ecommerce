<template>
    <UiCenter>
        <UiHeading class="mx-auto"> Frequently Asked Questions </UiHeading>
        <div class="flex flex-col divide-y py-10 sm:px-8 lg:px-12 xl:px-32 divide-gray-700">
            <UiDetails title="Delivery Information"
                message="[Shipping fee] <br>
                        Standard: Free <br>
                        - We ship all our products via SingPost.<br>
                        - This site shall not be held responsible for any loss or damage that occurs after
                        delivery has been completed.<br><br>

                        [Delivery time]<br>
                        - Shipping takes place between Monday to Friday, excluding holidays and weekends.<br>
                        - Typically, orders are processed and shipped within 2-3 business days.<br>" />
            <UiDetails title="Payment Methods"
                message="We currently accept credit cards, debit cards and PayNow payment methods." />
            <UiDetails title="Returns, Exchanges due to product defects"
                message="Yes, we have a hassle-free return policy. If there is a defect in the product you received,
                        you can initiate a return within 7 days of receiving the product. You can contact us
                        at <span class='underline'>info@ta1-shop.com</span> for assistance." />
            <UiDetails title="Do you offer international shipping?"
                message="Currently, we only provide shipping services within Singapore." />
        </div>
    </UiCenter>
</template>

<script lang="ts" setup>
useSeoMeta({
    title: "FAQ - Together as One Store",
});
</script>