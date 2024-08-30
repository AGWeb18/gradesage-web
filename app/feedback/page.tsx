"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, feedback }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      // Redirect to a thank you page or back to the dashboard
      router.push("/feedback-thank-you");
    } catch (error) {
      setSubmitError(
        "An error occurred while submitting your feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Submit Feedback
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows={5}
              required
            ></textarea>
          </div>
          {submitError && (
            <div className="mb-4 text-red-500">{submitError}</div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </main>
    </div>
  );
}
