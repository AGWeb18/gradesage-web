"use client";

import React from "react";
import Header from "../components/Header";
import { useTheme } from "next-themes";

const FAQPage: React.FC = () => {
  const { theme } = useTheme();
  const faqs = [
    {
      question: "How does this service help reduce teaching fatigue?",
      answer:
        "Our AI-powered grading system automates the time-consuming process of evaluating written responses, allowing teachers to focus on more impactful tasks like lesson planning and one-on-one student interactions. This significantly reduces the mental and emotional strain associated with grading large volumes of assignments.",
    },
    {
      question: "How does your system address potential bias in grading?",
      answer:
        "Our AI model is designed to evaluate responses based solely on their content and quality, without being influenced by factors like student names or writing styles. This helps to minimize unconscious biases that human graders might unintentionally introduce. Additionally, our system provides consistent grading criteria across all submissions, ensuring fairness in evaluation.",
    },
    {
      question: "Is my students' data safe and private?",
      answer:
        "We take data privacy and security very seriously. We do not store any student data or submitted content. The only information we retain is the user's email address for account purposes. All processing is done in real-time, and no assignment data is kept after the grading process is complete.",
    },
    {
      question: "How accurate is the AI grading compared to human grading?",
      answer:
        "Our AI grading system uses state-of-the-art language models to provide high-quality evaluations. While AI technology continues to evolve rapidly, we always recommend that teachers review the AI-generated grades and feedback, especially for high-stakes assessments. The system is designed to assist educators, not replace their expertise.",
    },
    {
      question: "Can this system handle different subjects and grade levels?",
      answer:
        "Yes, our AI model is versatile and can be applied to a wide range of subjects and grade levels, from middle school to higher education. It's particularly effective in grading open-ended questions in subjects like literature, history, social sciences, and even some areas of STEM where written explanations are required.",
    },
    {
      question: "How does this service improve the feedback students receive?",
      answer:
        "Our AI provides detailed, constructive feedback for each response, highlighting strengths and areas for improvement. This level of consistent, in-depth feedback would be extremely time-consuming for teachers to produce manually for every student. The quick turnaround also allows students to receive feedback while the assignment is still fresh in their minds, enhancing the learning process.",
    },
    {
      question: "What if I disagree with the AI's grading or feedback?",
      answer:
        "Teachers always have the final say. Our system is designed to be a tool that assists educators, not replace them. You can easily review and adjust any grades or feedback before finalizing them. This process often takes far less time than grading from scratch and still allows for your professional judgment and insight.",
    },
    {
      question: "How does your service handle plagiarism detection?",
      answer:
        "While our primary focus is on grading and providing feedback, our system can flag responses that show unusual similarities to other submissions within the same class. However, for comprehensive plagiarism checking, we recommend using specialized plagiarism detection tools in conjunction with our service.",
    },
    {
      question: "Is there a limit to how many submissions I can process?",
      answer:
        "The number of submissions you can process depends on your subscription plan. Our Basic plan allows for 500 requests per month, while our Pro plan increases this to 1000. For institutions with higher volume needs, we offer an Enterprise plan with unlimited requests. You can always upgrade your plan if you need to process more submissions.",
    },
    {
      question:
        "How does this service integrate with existing Learning Management Systems (LMS)?",
      answer:
        "We're currently working on integrations with popular LMS platforms. In the meantime, you can easily export our grading results and feedback in CSV format, which can be imported into most LMS gradebooks. We're always open to feedback on which integrations would be most valuable to our users.",
    },
  ];

  return (
    <div
      className={`flex flex-col min-h-screen ${
        theme === "dark" ? "bg-background-dark" : "bg-background-light"
      }`}
    >
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        <h1
          className={`text-3xl font-bold mb-8 ${
            theme === "dark" ? "text-text-dark" : "text-text-light"
          }`}
        >
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-md rounded-lg p-6`}
            >
              <h2
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-text-dark" : "text-text-light"
                }`}
              >
                {faq.question}
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
