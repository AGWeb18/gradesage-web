import React from "react";
import Link from "next/link";

export default function HeroComponent() {
  return (
    <section className="text-center mb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-5xl sm:text-5xl font-bold text-primary-light dark:text-primary-dark mb-4">
        Your AI Grading Assistant
      </h1>
      <h2 className="text-2xl sm:text-3xl text-text-light dark:text-text-dark mb-6">
        Save Hours on Assignment Evaluation
      </h2>
      <ul className="text-center mb-8 space-y-2 flex flex-col items-center text-black dark:text-text-dark">
        <li className="flex items-center">
          <span className="mr-2">✅</span> Grade essays and long-form answers in
          minutes, not hours
        </li>
        <li className="flex items-center">
          <span className="mr-2">✅</span> Ensure consistent, unbiased
          evaluation for every student
        </li>
        <li className="flex items-center">
          <span className="mr-2">✅</span> Integrate seamlessly with
          Desire2Learn and other LMS platforms
        </li>
      </ul>
      <div className="space-y-4">
        <div className="transition-transform duration-300 ease-in-out hover:scale-105">
          <Link
            href="/dashboard"
            className="inline-block bg-primary-light dark:bg-primary-dark text-white py-4 px-8 rounded-full text-xl font-semibold hover:bg-opacity-90 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Try GradeSage AI Free
          </Link>
        </div>
        <p className="text-sm text-text-light dark:text-text-dark">
          Join 1,000+ educators saving time with GradeSage AI
        </p>
      </div>
    </section>
  );
}
