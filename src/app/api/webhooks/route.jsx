import { user_data } from '@/db/schema'
import { db } from '@/utils/dbConfig'
import { verifyWebhook } from '@clerk/nextjs/webhooks'

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req, {
      secret: process.env.CLERK_WEBHOOK_SECRET,
    })

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    if (eventType === 'user.created') {
      const { id: userId, first_name, last_name, email_addresses } = evt.data;
      const email = email_addresses?.[0]?.email_address || 'unknown@example.com';

      await db.insert(user_data).values({
        user_id: userId,
        first_name: first_name || '',
        last_name: last_name || '',
        email_address: email,
      });

      console.log('User successfully added to the database.');
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}