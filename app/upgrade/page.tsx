"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PricingSection from "../components/PricingComponent";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UpgradePage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-text-light dark:text-text-dark">
          Upgrade Your Plan
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          Choose the plan that best fits your needs and take your grading to the
          next level!
        </p>
        <PricingSection showCurrentPlan={true} />
        {session && (
          <div className="mt-12 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">
              Need to make changes?
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              While we'd love to keep you on your current plan, we understand
              that needs change. Here are your options:
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out text-center"
              >
                Contact Support
              </Link>
              <button
                onClick={() => {
                  console.log("Downgrade plan clicked");
                  // Implement downgrade logic here
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Downgrade Plan
              </button>
              <button
                onClick={() => {
                  console.log("Cancel subscription clicked");
                  // Implement cancellation logic here
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
