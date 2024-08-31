"use client";

import React from "react";
import Header from "../components/Header";
import { useTheme } from "next-themes";
import Footer from "../components/Footer";

const FAQPage: React.FC = () => {
  const { theme } = useTheme();
  const faqs = [
    {
      question: "How does this service help enhance the grading process?",
      answer:
        "Our AI-powered screening tool assists teachers by providing an initial assessment of written responses. This allows educators to focus their expertise on refining grades, providing personalized feedback, and addressing complex aspects of student work. The tool is designed to streamline the grading process, not replace teacher judgment.",
    },
    {
      question:
        "How does your system maintain fairness in the screening process?",
      answer:
        "Our AI model is designed to provide consistent initial assessments based solely on content and quality. This helps minimize potential biases and ensures a uniform baseline for all submissions. However, teachers always have the final say and can adjust grades based on their professional judgment and knowledge of individual student contexts.",
    },
    {
      question:
        "Is my students' data safe and private when using this screening tool?",
      answer:
        "We prioritize data privacy and security. We do not store any student data or submitted content beyond the immediate screening process. The only information we retain is the user's email address for account purposes. All processing is done in real-time, ensuring that sensitive information is not kept after the initial assessment is complete.",
    },
    {
      question: "How accurate is the AI screening compared to human grading?",
      answer:
        "Our AI screening tool uses advanced language models to provide initial assessments. While it's highly effective for preliminary evaluation, it's designed to support, not replace, educator expertise. We always recommend that teachers review and refine the AI-generated assessments, especially for high-stakes assignments. The tool's purpose is to give teachers a head start, allowing them to allocate more time to nuanced aspects of grading.",
    },
    {
      question:
        "Can this screening tool handle different subjects and grade levels?",
      answer:
        "Yes, our AI model is versatile and can provide initial assessments for a wide range of subjects and grade levels, from middle school to higher education. It's particularly useful for screening open-ended questions in subjects like literature, history, social sciences, and even some areas of STEM where written explanations are required. However, teacher expertise remains crucial for final grading decisions.",
    },
    {
      question:
        "How does this service improve the feedback process for students?",
      answer:
        "Our AI provides preliminary feedback for each response, highlighting potential strengths and areas for improvement. This gives teachers a starting point to craft more detailed, personalized feedback. The quick initial screening allows educators to spend more time refining feedback and addressing individual student needs, enhancing the overall learning process.",
    },
    {
      question: "What if I disagree with the AI's initial assessment?",
      answer:
        "Teachers always have complete control over the final grades and feedback. Our system is designed as a supportive tool that provides an initial screening, not a replacement for professional judgment. You can easily adjust any assessments or feedback before finalizing them. This process often saves time compared to starting from scratch while still allowing for your expertise and insight to shape the final evaluation.",
    },
    {
      question: "How does your service handle potential plagiarism?",
      answer:
        "While our primary focus is on providing initial grade assessments and feedback, our system can flag responses that show unusual similarities to other submissions within the same class. This feature is meant to assist teachers in identifying potential areas for further review. However, for comprehensive plagiarism checking, we recommend using specialized plagiarism detection tools in conjunction with our service.",
    },
    {
      question: "Is there a limit to how many submissions I can screen?",
      answer:
        "The number of submissions you can screen depends on your subscription plan. Our Free plan allows for 10 screenings per month, the Basic plan allows for 300, while our Premium plan increases this to 1000. For institutions with higher volume needs, we offer a VIP plan with unlimited screenings. You can always upgrade your plan if you need to process more submissions.",
    },
    {
      question:
        "How does this screening tool integrate with existing Learning Management Systems (LMS)?",
      answer:
        "We're currently developing integrations with popular LMS platforms. In the meantime, you can easily export our screening results and initial feedback in CSV format, which can be imported into most LMS gradebooks. This allows you to use our tool alongside your existing systems, enhancing your grading workflow without disrupting it. We're always open to feedback on which integrations would be most valuable to our users.",
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
      <Footer />
    </div>
  );
};

export default FAQPage;
