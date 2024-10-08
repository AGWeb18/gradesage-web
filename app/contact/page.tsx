import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactFormWrapper from "../components/ContactFormWrapper";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-text-light dark:text-text-dark">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">
              Get in Touch
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              We&apos;d love to hear from you. Please fill out the form below or
              use our contact information to reach out.
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">
                Email
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                gradesageai@gmail.com
              </p>
            </div>
          </div>
          <div>
            <ContactFormWrapper />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
