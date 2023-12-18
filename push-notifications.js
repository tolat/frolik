const webpush = require('web-push');
require('dotenv').config();

// Set up VAPID keys
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  `mailto:${process.env.SENDMAIL_FROM}`, 
  publicVapidKey,
  privateVapidKey
);

// Replace with the subscription object you want to send the notification to
const subscription = {
  endpoint: 'https://example.com/push-endpoint',
  keys: {
    auth: 'auth-key',
    p256dh: 'p256dh-key',
  },
};

// Payload of the notification
const payload = JSON.stringify({
  title: 'Test Notification',
  body: 'This is a test push notification.',
});

// Send the notification
webpush
  .sendNotification(subscription, payload)
  .then(() => console.log('Notification sent successfully'))
  .catch((error) => console.error('Error sending notification:', error));
