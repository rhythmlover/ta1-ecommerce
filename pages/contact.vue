<template>
    <UiCenter>
        <UiHeading class="mx-auto"> Contact Us </UiHeading>

        <div class="min-h-full max-w-2xl mx-auto px-4">
            <div class="space-y-6 mb-8">
                <UiParagraph>
                    Depending on the content, it may take some time for us to respond.
                    Please note that inquiries on weekends and public holidays
                    will be responded to from the next business day onwards.
                </UiParagraph>

                <UiParagraph class="italic">
                    *When inquiring about an order, please be sure to include your "order number", "name" and the "email"
                    that you received the order receipt on.
                </UiParagraph>

                <UiParagraph class="italic">
                    *Please check the "Frequently Asked Questions" before making an inquiry.
                </UiParagraph>

                <div class="space-y-2">
                    <UiParagraph>
                        Please do not contact us through our alternative platforms for any inquiries regarding your
                        order made on this website.
                        It will be difficult for us to provide you with the necessary information.
                        Instead, please contact us through the inquiry form on this page or directly via email at
                        info@ta1-shop.com.
                    </UiParagraph>
                </div>
            </div>

            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <UiInput v-model="botSniffer" label="Leave this empty" placeholder="Leave this empty" class="hidden"/>
                    <UiInput v-model="name" label="Name" placeholder="Name" />
                    <UiInput v-model="email" label="Email" placeholder="Email" />
                </div>
                <UiInput v-model="orderNo" label="Order no." placeholder="Order no. (if applicable)" />
                <textarea v-model="message"
                    class="h-25 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    label="Message" placeholder="Message" />
                <div class="flex text-center items-center">
                    <UiButton @click="sendEmail" class="w-25"> Send </UiButton>
                </div>
                
                <UiErrorAlert />
                <UiSuccessAlert />
            </div>
        </div>
    </UiCenter>
</template>

<script lang="ts" setup>
const botSniffer = ref('');
const name = ref('');
const email = ref('');
const orderNo = ref('');
const message = ref('');

const alertStore = useAlertStore();

onMounted(() => {
    alertStore.clearAlert();
});

async function sendEmail() {
    if (botSniffer.value) {
        return;
    }

    if (!name.value || !email.value || !message.value) {
        alertStore.showAlert('Please fill in name, email, and message.', 'error');
        return;
    }

    if (!email.value.includes('@') || !email.value.includes('.')) {
        alertStore.showAlert('Please enter a valid email address', 'error');
        return;
    }

    const res = await sendInquiryEmail(name.value, email.value, message.value, orderNo.value);

    if (res.message === 'Email sent successfully') {
        alertStore.clearAlert();
        alertStore.showAlert('Your inquiry has been sent successfully!', 'success');
        name.value = '';
        email.value = '';
        orderNo.value = '';
        message.value = '';
    } else {
        alertStore.showAlert('An error occurred. Please try again later.', 'error');
    }
}

useSeoMeta({
    title: "Contact Us - Together as One Store",
    description: "Contact us for any inquiries or support regarding your order.",
    keywords: "contact, inquiry, support, order, together as one store",
});
</script>