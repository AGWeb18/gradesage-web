"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import LoadingScreen from "../components/LoadingScreen";
import {
  FaUpload,
  FaTable,
  FaChartBar,
  FaExclamationTriangle,
  FaDownload,
} from "react-icons/fa";
import Link from "next/link";

const downloadData = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any[] | null>(null);
  const [worstQuestion, setWorstQuestion] = useState<{
    question: string;
    averageScore: number;
  } | null>(null);
  const [maxScore, setMaxScore] = useState<number>(0);
  const [usernameCol, setUsernameCol] = useState<string>("");
  const [questionTypeCol, setQuestionTypeCol] = useState<string>("");
  const [questionCol, setQuestionCol] = useState<string>("");
  const [answerCol, setAnswerCol] = useState<string>("");
  const [mcScoreCol, setMcScoreCol] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [subscriptionType, setSubscriptionType] = useState("Basic");
  const [requestCount, setRequestCount] = useState(0);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(
    null
  );
  const [requestLimit, setRequestLimit] = useState<number>(300);
  const [isProcessing, setIsProcessing] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [upgradeInfo, setUpgradeInfo] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user-data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched user data:", data);
      setSubscriptionType(data.subscriptionType);
      setRequestCount(data.requestCount);
      setRemainingRequests(data.remainingRequests);
      setRequestLimit(data.limit);
      setDaysLeft(data.daysLeft);
      setUpgradeInfo(data.upgradeInfo);

      if (data.requestCount >= data.limit) {
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("/api/get-columns", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setColumns(data.columns);
        } else {
          console.error("Failed to fetch columns:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsProcessing(true);
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("maxScore", maxScore.toString());
    formData.append("usernameCol", usernameCol);
    formData.append("questionTypeCol", questionTypeCol);
    formData.append("questionCol", questionCol);
    formData.append("answerCol", answerCol);
    formData.append("mcScoreCol", mcScoreCol);

    try {
      const response = await fetch("/api/process-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process CSV");
      }

      const data = await response.json();
      setResults(data.gradedResponses);
      setSummary(data.summary);
      setWorstQuestion(data.worstQuestion);

      console.log("CSV processed successfully");
      await fetchUserData();
      console.log("User data updated after CSV processing");
    } catch (err) {
      setError("An error occurred while processing the file.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <Suspense fallback={<LoadingScreen />}>
        {isProcessing ? (
          <LoadingScreen />
        ) : (
          <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
              Dashboard
            </h1>
            <p className="mb-6 sm:mb-8 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Welcome, {session?.user?.name || "Guest"}!
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Subscription Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <p className="text-gray-800 dark:text-gray-300">Plan</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {subscriptionType}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <p className="text-gray-800 dark:text-gray-300">
                    Requests this month
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {requestCount}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <p className="text-gray-800 dark:text-gray-300">
                    Remaining requests
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {remainingRequests}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <p className="text-gray-800 dark:text-gray-300">
                    Request limit
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {requestLimit === Infinity ? "Unlimited" : requestLimit}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <p className="text-gray-800 dark:text-gray-300">
                    Days left in current cycle
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {daysLeft}
                  </p>
                </div>
              </div>
              {upgradeInfo && (
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md">
                  <p className="font-semibold">Upgrade your plan!</p>
                  <p>{upgradeInfo}</p>
                  <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Upgrade Now
                  </button>
                </div>
              )}
              {remainingRequests !== null &&
                remainingRequests <= 10 &&
                requestLimit !== Infinity && (
                  <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        Warning: You are approaching your request limit!
                      </p>
                      <p>
                        Consider upgrading your plan to avoid interruptions.
                      </p>
                    </div>
                    <Link
                      href="/upgrade"
                      className="ml-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                      Upgrade Now
                    </Link>
                  </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <FaUpload className="mr-2" /> Upload CSV
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="csvFile"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Select File
                  </label>
                  <input
                    type="file"
                    id="csvFile"
                    accept={
                      subscriptionType === "Premium" ||
                      subscriptionType === "VIP"
                        ? ".csv,.mp4,.avi,.mov"
                        : ".csv"
                    }
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={isDisabled}
                  />
                  {subscriptionType === "Basic" && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Upgrade to Premium for audio grading or VIP for video
                      grading. Remaining requests: {remainingRequests}/
                      {requestLimit}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="maxScore"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Max Score
                    </label>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => setMaxScore(Math.max(0, maxScore - 1))}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        -
                      </button>
                      <input
                        id="maxScore"
                        type="number"
                        min="0"
                        value={maxScore}
                        onChange={(e) => setMaxScore(Number(e.target.value))}
                        className="w-full px-3 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-center text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => setMaxScore(maxScore + 1)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="usernameCol"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Username Column
                    </label>
                    <select
                      id="usernameCol"
                      value={usernameCol}
                      onChange={(e) => setUsernameCol(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900"
                    >
                      <option value="">Select Username Column</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="questionTypeCol"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Question Type Column
                    </label>
                    <select
                      id="questionTypeCol"
                      value={questionTypeCol}
                      onChange={(e) => setQuestionTypeCol(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900"
                    >
                      <option value="">Select Question Type Column</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="questionCol"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Question Column
                    </label>
                    <select
                      id="questionCol"
                      value={questionCol}
                      onChange={(e) => setQuestionCol(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900"
                    >
                      <option value="">Select Question Column</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="answerCol"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Answer Column
                    </label>
                    <select
                      id="answerCol"
                      value={answerCol}
                      onChange={(e) => setAnswerCol(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900"
                    >
                      <option value="">Select Answer Column</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="mcScoreCol"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      MC Score Column
                    </label>
                    <select
                      id="mcScoreCol"
                      value={mcScoreCol}
                      onChange={(e) => setMcScoreCol(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900"
                    >
                      <option value="">Select MC Score Column</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || isDisabled}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Process CSV"}
                </button>
              </form>
            </div>

            {error && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8"
                role="alert"
              >
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {results && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <FaTable className="mr-2" /> Results
                  </h2>
                  <button
                    onClick={() => downloadData(results, "graded_responses")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {Object.keys(results[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {results.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {summary && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <FaChartBar className="mr-2" /> Summary
                  </h2>
                  <button
                    onClick={() => downloadData(summary, "summary")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          MC Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          AI Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Score Out of
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {summary.map((row, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {row.student}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {row.mcScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {row.aiScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {row.totalWithBellcurve}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {row.scoreOutOf}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {worstQuestion && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <FaExclamationTriangle className="mr-2" /> Worst Question
                  </h2>
                  <button
                    onClick={() =>
                      downloadData(worstQuestion, "worst_question")
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Question
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Average Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {worstQuestion.question}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {worstQuestion.averageScore}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        )}
      </Suspense>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Need Help?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Check out our frequently asked questions for more information or
            contact us directly.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
            <a
              href="/faq"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
            >
              Go to FAQ
            </a>
            <Link
              href="/feedback"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
            >
              Submit Feedback
            </Link>
            <Link
              href="/contact"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
