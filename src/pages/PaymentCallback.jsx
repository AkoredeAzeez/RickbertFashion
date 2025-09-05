import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { paystackVerify } from "../lib/api";
import { useCart } from "../state/CartContext";

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const reference = params.get("reference");
  const [status, setStatus] = useState("verifying...");
  const { clearCart } = useCart();

  useEffect(() => {
    if (!reference) return;
    paystackVerify(reference)
      .then((r) => {
        setStatus(r.status);
        if (r.status === "paid") clearCart();
      })
      .catch(() => setStatus("failed"));
  }, [clearCart, reference]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Payment {status}</h1>
      <p className="mb-6">Reference: {reference || "N/A"}</p>
      <Link to="/" className="underline">Back to shop</Link>
    </div>
  );
}
