import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Lock, Shield, Truck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { COLOR_VARIANTS } from "@/components/voxalife/sceneUtils";

const PRICE = 20000;
const TAX_RATE = 0.08;

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const colorKey = searchParams.get("color") || "titaniumSilver";
  const qty = parseInt(searchParams.get("qty") || "1", 10);

  const color = COLOR_VARIANTS[colorKey] || COLOR_VARIANTS.titaniumSilver;
  const subtotal = PRICE * qty;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    shipping_address: "",
    city: "",
    postal_code: "",
    country: "",
    card_number: "",
    card_expiry: "",
    card_cvc: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    for (const field of [
      "customer_name",
      "customer_email",
      "shipping_address",
      "city",
      "postal_code",
      "country",
      "card_number",
      "card_expiry",
      "card_cvc",
    ]) {
      if (!form[field] || !form[field].trim()) {
        setError("Please fill in all fields.");
        return;
      }
    }

    setLoading(true);
    try {
      const orderNumber = "GL-" + Date.now().toString(36).toUpperCase();
      const cardLast4 = form.card_number.replace(/\s/g, "").slice(-4);

      const { data: order, error: insertError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          product_name: "GrapheneLabs Smart Electrolarynx",
          color_variant: color.name,
          quantity: qty,
          unit_price: PRICE,
          total_price: total,
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          shipping_address: form.shipping_address,
          city: form.city,
          postal_code: form.postal_code,
          country: form.country,
          card_last4: cardLast4,
          status: "confirmed",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      supabase.functions.invoke("send-order-email", {
        body: {
          order: {
            order_number: orderNumber,
            product_name: "GrapheneLabs Smart Electrolarynx",
            color_variant: color.name,
            quantity: qty,
            total_price: total,
            customer_name: form.customer_name,
            customer_email: form.customer_email,
            shipping_address: form.shipping_address,
            city: form.city,
            postal_code: form.postal_code,
            country: form.country,
          },
        },
      }).catch((err) => console.error("Failed to send email:", err));

      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[#F8FAFC] placeholder-slate-600 focus:border-[#38BDF8] focus:outline-none transition-colors text-sm";
  const labelClass =
    "block text-xs uppercase tracking-wider text-slate-500 mb-2";

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC]">
      <div className="border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/product"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F8FAFC] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
          <Link to="/" className="text-lg font-medium tracking-tight">
            GrapheneLabs
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-8 order-2 md:order-1">
          <div>
            <h2 className="text-xl font-light mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  name="customer_email"
                  type="email"
                  value={form.customer_email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input
                  name="shipping_address"
                  value={form.shipping_address}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="94101"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-light mb-6">Payment</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Card Number</label>
                <input
                  name="card_number"
                  value={form.card_number}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="4242 4242 4242 4242"
                  maxLength="19"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expiry</label>
                  <input
                    name="card_expiry"
                    value={form.card_expiry}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="MM / YY"
                    maxLength="7"
                  />
                </div>
                <div>
                  <label className={labelClass}>CVC</label>
                  <input
                    name="card_cvc"
                    value={form.card_cvc}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="123"
                    maxLength="4"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#38BDF8] text-[#020617] font-medium hover:bg-[#7DD3FC] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processing..."
              : `Place Order — ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </button>
        </form>

        <div className="md:sticky md:top-12 md:self-start order-1 md:order-2">
          <h2 className="text-xl font-light mb-6">Order Summary</h2>
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-4">
            <div className="flex gap-4">
              <div
                className="w-16 h-20 rounded-xl flex-shrink-0 border border-slate-800 flex items-center justify-center"
                style={{ background: color.body }}
              >
                <svg width="20" height="40" viewBox="0 0 20 40" fill="none">
                  <rect
                    x="6"
                    y="3"
                    width="8"
                    height="34"
                    rx="4"
                    fill={color.grip}
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  GrapheneLabs Smart Electrolarynx
                </p>
                <p className="text-xs text-slate-500 mt-1">{color.name}</p>
                <p className="text-xs text-slate-500">Qty: {qty}</p>
              </div>
              <p className="text-sm">₹{subtotal.toLocaleString("en-IN")}</p>
            </div>
            <div className="border-t border-slate-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-[#38BDF8]">Free</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8%)</span>
                <span>
                  ₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-lg font-light pt-2 border-t border-slate-800">
                <span>Total</span>
                <span>
                  ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" /> Your payment information is
              encrypted and secure.
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Truck className="w-3.5 h-3.5" /> Free shipping · Delivers in 3–5
              business days.
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5" /> 1-year warranty · 30-day return
              policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
