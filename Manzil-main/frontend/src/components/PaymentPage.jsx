import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const PaymentPage = ({ user, selectedPlan }) => {
  const { email, id } = user || {};
  const { plan, amount } = selectedPlan || {};

  const savePayment = useCallback(
    async ({ transactionId, method, status }) => {
      try {
        await axios.post("http://localhost:1337/api/payments", {
          data: {
            userId: id,
            email,
            plan,
            amount,
            method,
            status,
            transactionId,
            timestamp: new Date(),
          },
        });

        await axios.put(`http://localhost:1337/api/users/${id}`, {
          data: {
            subscriptionStatus: "active",
            plan,
          },
        });
      } catch (err) {
        console.error("Failed to save payment:", err);
      }
    },
    [id, email, plan, amount]
  );

  const handleRazorpay = useCallback(() => {
    const options = {
      key: "rzp_test_3vxgJTKcQFi7w1",
      amount: amount * 100,
      currency: "INR",
      name: "Manzil Subscription",
      description: plan,
      handler: async (response) => {
        await savePayment({
          transactionId: response.razorpay_payment_id,
          method: "Razorpay",
          status: "Success",
        });
        alert("Payment successful!");
      },
      prefill: { email },
      theme: { color: "#3399cc" },
      // No modal.ondismiss here
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [amount, email, plan, savePayment]);

  useEffect(() => {
    if (email && id && plan && amount) {
      handleRazorpay();
    }
  }, [email, id, plan, amount, handleRazorpay]);

  if (!email || !id || !plan || !amount) {
    return (
      <div className="p-6 text-center text-red-600">
        Missing payment details. Please try again.
      </div>
    );
  }

  return null; // No UI, just auto-payment
};

PaymentPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.any.isRequired,
    email: PropTypes.string.isRequired,
  }),
  selectedPlan: PropTypes.shape({
    plan: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }),
};

export default PaymentPage;
