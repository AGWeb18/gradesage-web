import React from "react";
import Link from "next/link";

const plans = [
  {
    name: "Regular",
    price: "$15/month",
    description: "Perfect for basic grading needs.",
    features: ["Text Grading", "Up to 300 submissions/month", "Email support"],
    link: "https://buy.stripe.com/28ocO9fMubQB0EgbII",
  },
  {
    name: "Premium",
    price: "$30/month",
    description: "Ideal for comprehensive grading solutions.",
    features: [
      "Text Grading",
      "Audio Grading",
      "Up to 1000 submissions/month",
      "Priority support",
    ],
    link: "https://buy.stripe.com/14k7tP1VE6wh1IkcMO",
  },
  {
    name: "VIP",
    price: "$99/month",
    description: "Complete package for demanding educators.",
    features: [
      "Text Grading",
      "Video Grading",
      "Audio Grading",
      "Unlimited submissions",
      "24/7 customer support",
      "Advanced analytics",
    ],
    link: "https://buy.stripe.com/cN25lH6bUaMxev64gj",
  },
];

export default function PricingSection() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 sm:mb-12 text-gray-800 dark:text-white">
          Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 p-6 sm:p-8 rounded-lg shadow-md flex flex-col"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                {plan.name}
              </h3>
              <p className="text-3xl sm:text-4xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
                {plan.price}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {plan.description}
              </p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center mb-2 text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.link}
                className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-indigo-700 transition duration-300 text-center dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-gray-600 dark:text-gray-300 font-semibold">
          Cancel Anytime
        </p>
      </div>
    </section>
  );
}
