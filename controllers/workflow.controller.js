import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

const REMINDERS = [7, 5, 2, 1]

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    // For testing: if renewal date is very soon or in the past, send reminder immediately
    const daysUntilRenewal = renewalDate.diff(dayjs(), 'day');

    if(daysUntilRenewal <= 7 && daysUntilRenewal >= 0) {
        // Send immediate reminder for testing purposes
        const daysBeforeValue = daysUntilRenewal === 0 ? 1 : daysUntilRenewal;
        await triggerReminder(context, `${daysBeforeValue} days before reminder`, subscription);
        console.log(`Sent immediate reminder for subscription ${subscriptionId}`);
        return;
    }

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        try {
            console.log(`[WORKFLOW] Triggering ${label} reminder for subscription: ${subscription.name}`);

            await sendReminderEmail({
                to: subscription.user.email,
                type: label,
                subscription,
            });

            console.log(`[WORKFLOW] ${label} reminder sent successfully`);
        } catch (error) {
            console.error(`[WORKFLOW ERROR] Failed to trigger ${label}:`, error.message);
            throw error;
        }
    })
}