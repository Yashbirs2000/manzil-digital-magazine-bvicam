import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle2,
  Mail,
  BadgeCheck,
  LogOut,
  CreditCard,
  CalendarCheck,
} from "lucide-react";
import PaymentPage from "./PaymentPage";

const plans = [
  {
    title: "MANZIL Premium Weekly",
    price: "₹ 1 /-",
    label: "7-day FREE TRIAL",
    plan: "Weekly - ₹ 1 /-",
  },
  {
    title: "MANZIL Premium Monthly",
    price: "₹ 249 /-",
    label: "14-day FREE TRIAL",
    badge: "Most Popular",
    plan: "Monthly - ₹ 249 /-",
  },
  {
    title: "MANZIL Premium Annual",
    price: "₹ 2,499 /-",
    label: "30-day FREE TRIAL",
    badge: "Best Deal",
    plan: "Annual - ₹ 2,499 /-",
  },
];

const Userdash = () => {
  const [user, setUser] = useState(null);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/Home");
  };

  const handleSubscribe = (plan) => {
    if (!user) return navigate("/login");
    setSelectedPlan(plan);
    setShowPaymentPage(true);
  };

  const closeModal = () => {
    setShowPaymentPage(false);
    setSelectedPlan(null);
  };

  if (!user)
    return <p className="mt-20 text-center text-gray-600">Loading user data...</p>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto mt-10 space-y-8">
        {/* User Card */}
        <div className="flex flex-col items-center justify-between p-6 shadow-xl rounded-xl md:flex-row">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <UserCircle2 className="w-24 h-24 text-blue-500" />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-blue-700">
                Welcome, {user.username}!
              </h1>
              <p className="flex items-center justify-center gap-2 mt-2 text-gray-600 md:justify-start">
                <Mail className="w-5 h-5 text-gray-500" />
                {user.email}
              </p>
              <p className="flex items-center justify-center gap-2 text-gray-600 md:justify-start">
                <BadgeCheck className="w-5 h-5 text-gray-500" />
                User ID: {user.id}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 mt-4 text-white bg-red-500 rounded-lg md:mt-0 hover:bg-red-600"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Subscription Section */}
        <div className="p-6 shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-semibold text-blue-700">
            Subscription Details
          </h2>

          {user.subscription ? (
            <>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  Plan: {user.subscription.plan}
                </p>
                <p className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-gray-500" />
                  Status: {user.subscription.status}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-gray-500" />
                  Renewal Date: {user.subscription.renewalDate}
                </p>
              </div>

              <button
                onClick={() => navigate("/update-subscription")}
                className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Update Plan
              </button>
            </>
          ) : (
            <>
              
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map(({ title, price, label, badge, plan }, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl p-6 shadow-md hover:shadow-xl transition ${
                      badge ? "border-2 border-blue-700" : ""
                    }`}
                  >
                    {badge && (
                      <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                        {badge}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-blue-800">{title}</h3>
                    <p className="mt-2 text-2xl font-extrabold">{price}</p>
                    <p className="text-sm text-gray-600">
                      {plan.split(" - ")[0]} Subscription
                    </p>
                    <p className="mt-2 text-xs text-gray-500">{label}</p>
                    <button
                      onClick={() =>
                        handleSubscribe({
                          plan,
                          amount: parseInt(price.replace(/[^\d]/g, "")),
                        })
                      }
                      className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <PaymentPage selectedPlan={selectedPlan} user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Userdash;
