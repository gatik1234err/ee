import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });

interface OrderData {
  order_number: string;
  product_name: string;
  color_variant: string;
  quantity: number;
  total_price: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  country: string;
}

interface RequestBody {
  order: OrderData;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const { order }: RequestBody = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: order.customer_email,
        subject: `Order Confirmed — ${order.order_number}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 300; margin: 0;">Order Confirmed</h1>
              <p style="color: #666; margin-top: 8px;">Thank you for your purchase, ${order.customer_name}.</p>
            </div>

            <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <p style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Order Number</p>
              <p style="font-size: 18px; font-weight: 500; margin: 0;">${order.order_number}</p>
            </div>

            <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="font-size: 14px; font-weight: 600; margin: 0 0 16px;">Order Details</h2>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                  <td style="color: #888; padding: 4px 0;">Product</td>
                  <td style="text-align: right; padding: 4px 0;">${order.product_name}</td>
                </tr>
                <tr>
                  <td style="color: #888; padding: 4px 0;">Color</td>
                  <td style="text-align: right; padding: 4px 0;">${order.color_variant}</td>
                </tr>
                <tr>
                  <td style="color: #888; padding: 4px 0;">Quantity</td>
                  <td style="text-align: right; padding: 4px 0;">${order.quantity}</td>
                </tr>
                <tr>
                  <td style="color: #888; padding: 4px 0; border-top: 1px solid #e5e7eb;">Total Paid</td>
                  <td style="text-align: right; padding: 4px 0; border-top: 1px solid #e5e7eb; font-weight: 600;">₹${order.total_price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              </table>
            </div>

            <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="font-size: 14px; font-weight: 600; margin: 0 0 16px;">Shipping To</h2>
              <p style="font-size: 14px; margin: 0; color: #333;">${order.customer_name}</p>
              <p style="font-size: 14px; margin: 4px 0; color: #666;">${order.shipping_address}</p>
              <p style="font-size: 14px; margin: 4px 0; color: #666;">${order.city}, ${order.postal_code}</p>
              <p style="font-size: 14px; margin: 4px 0; color: #666;">${order.country}</p>
            </div>

            <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #999;">GrapheneLabs — Smart Electrolarynx</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return json({ success: true, messageId: data.id });
  } catch (err) {
    console.error("Email send failed:", err);
    return json(
      { success: false, error: err.message },
      500
    );
  }
});
