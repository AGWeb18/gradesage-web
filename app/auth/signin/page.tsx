import SignIn from "@/app/components/SignIn";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="w-full md:w-1/2 max-w-md">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-text-light dark:text-text-dark">
              Welcome to GradeSage AI
            </h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              Join thousands of educators saving time and improving their
              grading process with AI-powered assistance.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">
                Why Choose GradeSage?
              </h2>
              <ul className="space-y-2">
                {[
                  "Lightning-Fast Grading",
                  "Unbiased Evaluation",
                  "Detailed Feedback",
                  "Multi-Format Support",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-600 dark:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
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
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/upgrade"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View our pricing plans →
            </Link>
          </div>
          <div className="w-full md:w-1/2 max-w-md">
            <SignIn />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
