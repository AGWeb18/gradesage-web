import React from "react";
import Link from "next/link";

export default function HeroComponent() {
  return (
    <section className="text-center mb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold text-primary-light dark:text-primary-dark mb-4">
        GradeSage AI
      </h1>
      <h2 className="text-xl sm:text-2xl text-text-light dark:text-text-dark mb-2">
        Smart screening for all platforms.
      </h2>
      <h2 className="text-xl sm:text-2xl text-text-light dark:text-text-dark mb-8">
        Desire2Learn and beyond.
      </h2>
      <div className="space-y-4">
        <div className="transition-transform duration-300 ease-in-out hover:scale-105">
          <Link
            href="/dashboard"
            className="inline-block bg-primary-light dark:bg-primary-dark text-white py-3 px-8 rounded-full font-semibold hover:bg-opacity-90 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Start Screening Smarter
          </Link>
        </div>
        <p className="text-sm text-text-light dark:text-text-dark">
          Join thousands of educators saving time with GradeSage AI
        </p>
      </div>
    </section>
  );
}
