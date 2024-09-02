"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ThankYouPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && session) {
      const fetchUserData = async () => {
        try {
          await update(); // Force update of the session
          const response = await fetch("/api/user-data");
          const data = await response.json();
          if (data.subscriptionType && data.subscriptionType !== "Free") {
            setPaymentConfirmed(true);
            setSubscriptionType(data.subscriptionType);
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          router.push("/");
        }
      };
      fetchUserData();
    }
  }, [isMounted, session, router, update]);

  if (!isMounted || !paymentConfirmed) {
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
            Your {subscriptionType} subscription has been activated
            successfully.
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
