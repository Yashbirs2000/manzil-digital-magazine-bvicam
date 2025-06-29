import { useState } from "react";
import { submitContactMessage } from "./api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (validateForm()) {
      try {
        const response = await submitContactMessage(formData);
        if (response.success) {
          setSuccessMessage("✅ Thank you! Your message has been sent successfully.");
          setFormData({ name: "", email: "", mobile: "", message: "" });
          setTimeout(() => setSuccessMessage(""), 10000);
        } else {
          setErrors({ form: response.message || "❌ Failed to submit message." });
        }
      } catch (err) {
        console.error("❌ Submission failed:", err);
        setErrors({ form: "Something went wrong. Please try again later." });
      }
    }
  };

  return (
    <div className="min-h-screen px-4 pt-10 text-gray-800 md:px-8 lg:px-10">
      <div className="w-full max-w-2xl p-6 mx-auto text-left bg-white border border-gray-200 rounded-lg shadow-lg md:p-8 lg:p-10">
      <p className="mb-5 font-semibold text-center text-black-700">
  Have any questions? Fill out the form and we’ll get back to you!
</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-left text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md md:p-4 focus:ring-2 focus:ring-indigo-500"
              placeholder="yourname"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-left text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md md:p-4 focus:ring-2 focus:ring-indigo-500"
              placeholder="example@gmail.com"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-left text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              className="w-full p-3 border border-gray-300 rounded-md md:p-4 focus:ring-2 focus:ring-indigo-500"
              placeholder="1234567890"
            />
            {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-left text-gray-700">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md md:p-4 focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your message here..."
            ></textarea>
            {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
          </div>

          {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
          {successMessage && <p className="text-sm font-semibold text-green-600">{successMessage}</p>}

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition duration-300 bg-indigo-600 rounded-md md:py-4 hover:bg-indigo-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
