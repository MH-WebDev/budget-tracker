import { user_data } from "@/db/schema";
import { db } from "@/utils/dbConfig";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req) {
  try {
    // Verify webhook authenticity
    const evt = await verifyWebhook(req, {
      secret: process.env.CLERK_WEBHOOK_SECRET,
    });

    // Validate and sanitize event data
    const { id } = evt.data || {};
    const eventType = evt.type || "";

    // Only allow known event types
    if (eventType === "user.created") {
      const { id: userId, first_name, last_name, email_addresses } = evt.data || {};
      // Basic sanitization
      const safeFirstName = typeof first_name === "string" ? first_name.replace(/[^\w\s'-]/g, "") : "";
      const safeLastName = typeof last_name === "string" ? last_name.replace(/[^\w\s'-]/g, "") : "";
      const email = (email_addresses?.[0]?.email_address || "unknown@example.com").replace(/[^\w@.\-]/g, "");

      await db.insert(user_data).values({
        user_id: userId,
        first_name: safeFirstName,
        last_name: safeLastName,
        email_address: email,
      });
    }

    // Do not log sensitive data
    // Return generic success message
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    // Log only generic error message
    console.error("Webhook error");
    return new Response("Webhook error", { status: 400 });
  }
}
