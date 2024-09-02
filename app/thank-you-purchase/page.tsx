"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ThankYouPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Add logic to verify payment confirmation here
      // If payment is not confirmed, redirect to another page
      const paymentConfirmed = true; // Replace with actual payment confirmation logic
      if (!paymentConfirmed) {
        router.push("/");
      }
    }
  }, [isMounted, router]);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-text-light dark:text-text-dark">
            Thank You for Your Purchase!
          </h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            Your transaction has been completed successfully.
          </p>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            You will receive an email confirmation shortly.
          </p>
          <div className="space-x-4">
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
            >
              Go to Home Page
            </Link>
            <Link
              href="/dashboard"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
