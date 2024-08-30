import React from "react";

const features = [
  {
    title: "Lightning-Fast Grading",
    description:
      "Grade hundreds of assignments in minutes, not hours. Save valuable time for more impactful teaching.",
    icon: "⚡",
  },
  {
    title: "Unbiased Evaluation",
    description:
      "Ensure fair and consistent grading across all students, eliminating human fatigue and subjectivity.",
    icon: "⚖️",
  },
  {
    title: "Detailed Feedback",
    description:
      "Provide students with in-depth, personalized feedback to enhance their learning experience.",
    icon: "📝",
  },
  {
    title: "Multi-Format Support",
    description:
      "Grade text, audio, and video submissions with equal ease and accuracy.",
    icon: "🎥",
  },
  {
    title: "24/7 Availability",
    description:
      "Our AI never sleeps, allowing students to receive instant feedback at any time.",
    icon: "🕰️",
  },
  {
    title: "Continuous Learning",
    description:
      "Our AI evolves with each use, constantly improving its grading accuracy and feedback quality.",
    icon: "🧠",
  },
];

export default function Features() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 sm:mb-12 text-text-light dark:text-text-dark">
          Revolutionize Your Grading Process
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg"
            >
              <div className="text-3xl sm:text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-text-light dark:text-text-dark">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
