import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Package, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError(true);
        } else {
          setOrder(data);
        }
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-[#38BDF8] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-400">Order not found.</p>
          <Link
            to="/"
            className="mt-6 inline-block text-[#38BDF8] hover:underline"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC]">
      <div className="border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to="/" className="text-lg font-medium tracking-tight">
            GrapheneLabs
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 mx-auto rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Check className="w-10 h-10 text-[#38BDF8]" strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-extralight"
        >
          Order Confirmed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-slate-400"
        >
          Thank you for your purchase. A confirmation email has been sent to{" "}
          {order.customer_email}.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 inline-block px-6 py-2 rounded-full bg-slate-900/60 border border-slate-800"
        >
          <span className="text-sm text-slate-500">Order Number</span>
          <p className="text-lg font-medium text-[#38BDF8] tracking-wider">
            {order.order_number}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 text-left"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-sm font-medium">Order Details</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Product</span>
              <span>{order.product_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Color</span>
              <span>{order.color_variant}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Quantity</span>
              <span>{order.quantity}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-800">
              <span className="text-slate-400">Total Paid</span>
              <span className="font-medium text-[#38BDF8]">
                ₹
                {order.total_price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 text-left"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-sm font-medium">Shipping To</h2>
          </div>
          <div className="text-sm text-slate-400 space-y-1">
            <p className="text-[#F8FAFC]">{order.customer_name}</p>
            <p>{order.shipping_address}</p>
            <p>
              {order.city}, {order.postal_code}
            </p>
            <p>{order.country}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-10"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#38BDF8] text-[#020617] font-medium hover:bg-[#7DD3FC] transition-all hover:scale-105"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
