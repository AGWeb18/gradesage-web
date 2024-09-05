import React from "react";
import Link from "next/link";

export default function HeroComponent() {
  return (
    <section className="text-center mb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-5xl sm:text-5xl font-bold text-primary-light dark:text-primary-dark mb-4">
        Your AI Grading Assistant
      </h1>

      <h2 className="text-2xl sm:text-3xl text-text-light dark:text-text-dark mb-6">
        Grade 150 questions in under 13 minutes
      </h2>
      <p className="text-sm text-text-light dark:text-text-dark mb-6">
        Join 1,000+ educators saving time with GradeSage AI
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-black dark:text-text-dark">
        <li className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105">
          <div className="text-5xl mb-4 text-blue-500">⚡</div>
          <h3 className="font-semibold">Rapid Grading</h3>
          <p className="mt-2 text-sm">
            Grade assignments in minutes, not hours
          </p>
        </li>
        <li className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105">
          <div className="text-5xl mb-4 text-green-500">⚖️</div>
          <h3 className="font-semibold">Unbiased Evaluation</h3>
          <p className="mt-2 text-sm">
            Consistent, fair grading for all students
          </p>
        </li>
        <li className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105">
          <div className="text-5xl mb-4 text-purple-500">🔗</div>
          <h3 className="font-semibold">Seamless Integration</h3>
          <p className="mt-2 text-sm">Works with your existing LMS platforms</p>
        </li>
      </ul>
      <div className="space-y-4">
        <div className="transition-transform duration-300 ease-in-out hover:scale-105">
          <Link
            href="/dashboard"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white py-4 px-8 rounded-full text-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl animate-pulse"
          >
            Try GradeSage AI Free
          </Link>
        </div>
      </div>
    </section>
  );
}
