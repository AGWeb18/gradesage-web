"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function FeedbackThankYouContent() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          router.push("/");
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center ${
          theme === "dark" ? "text-text-dark" : "text-text-light"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">
          Thank You for Your Feedback!
        </h1>
        <p className="mb-6 text-lg">
          We appreciate your input and will use it to improve our services.
        </p>
        <p className="mb-8">
          You will be redirected to the home page in {countdown} seconds.
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
  );
}
