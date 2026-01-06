import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'

export const sendReminderEmail = async ({ to, type, subscription }) => {
    try {
        if(!to || !type) throw new Error('Missing required parameters: to or type');

        const template = emailTemplates.find((t) => t.label === type);

        if(!template) throw new Error(`Invalid email type: ${type}. Available types: ${emailTemplates.map(t => t.label).join(', ')}`);

        const mailInfo = {
            userName: subscription.user.name,
            subscriptionName: subscription.name,
            renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
            planName: subscription.name,
            price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
            paymentMethod: subscription.paymentMethod,
            accountSettingsLink: 'https://example.com/settings',
            supportLink: 'https://example.com/support',
        }

        const message = template.generateBody(mailInfo);
        const subject = template.generateSubject(mailInfo);

        const mailOptions = {
            from: accountEmail,
            to: to,
            subject: subject,
            html: message,
        }

        console.log(`[EMAIL] Attempting to send ${type} email to ${to} for subscription: ${subscription.name}`);

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error);
                    reject(error);
                } else {
                    console.log(`[EMAIL SUCCESS] Email sent to ${to}. Response: ${info.response}`);
                    resolve(info);
                }
            })
        });
    } catch (error) {
        console.error(`[EMAIL ERROR] Exception in sendReminderEmail:`, error.message);
        throw error;
    }
}