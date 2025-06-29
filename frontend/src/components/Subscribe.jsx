import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SubscriptionPage() {
  const [, setSelectedPlan] = useState("");
  const navigate = useNavigate();

  const openLogin = (plan) => {
    setSelectedPlan(plan);
    navigate("/login", { state: { selectedPlan: plan } });
  };

  return (
    <div className="min-h-screen px-6 py-12 text-gray-800 md:px-12 lg:px-24">
      <h2 className="mb-8 text-3xl font-bold text-center">Our Membership</h2>

      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
        {/* Weekly Plan */}
        <div className="p-6 text-center rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">
            MANZIL Premium <span className="font-bold">Weekly</span>
          </h3>
          <p className="mt-2 text-2xl font-bold">₹ 99 /-</p>
          <p className="text-gray-600">Weekly Subscription</p>
          <p className="mt-2 text-gray-500">1-day FREE TRIAL</p>
          <button
            onClick={() => openLogin("Weekly - ₹ 99 /-")}
            className="px-6 py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Subscribe
          </button>
        </div>

        {/* Monthly Plan */}
        <div className="relative p-6 text-center border-2 border-blue-700 rounded-lg shadow-lg">
          <span className="absolute px-3 py-1 text-xs font-bold text-white uppercase transform -translate-x-1/2 bg-blue-700 rounded-full -top-4 left-1/2">
            Most Popular
          </span>
          <h3 className="text-xl font-semibold">
            MANZIL Premium <span className="font-bold">Monthly</span>
          </h3>
          <p className="mt-2 text-2xl font-bold">₹ 249 /-</p>
          <p className="text-gray-600">Monthly Subscription</p>
          <p className="mt-2 text-gray-500">14-day FREE TRIAL</p>
          <button
            onClick={() => openLogin("Monthly - ₹ 249 /-")}
            className="px-6 py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Subscribe
          </button>
        </div>

        {/* Annual Plan */}
        <div className="relative p-6 text-center border-2 border-blue-700 rounded-lg shadow-lg">
          <span className="absolute px-3 py-1 text-xs font-bold text-white uppercase transform -translate-x-1/2 bg-blue-700 rounded-full -top-4 left-1/2">
            Best Deal
          </span>
          <h3 className="text-xl font-semibold">
            MANZIL <span className="font-bold">Annual</span>
          </h3>
          <p className="mt-2 text-2xl font-bold">₹ 2,499 /-</p>
          <p className="text-gray-600">Annual Subscription</p>
          <p className="mt-2 text-gray-500">30-day FREE TRIAL</p>
          <button
            onClick={() => openLogin("Annual - ₹ 2,499 /-")}
            className="px-6 py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
