import React from "react";

interface ExampleCardProps {
  title: string;
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  title,
  question,
  answer,
  score,
  feedback,
}) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md transition duration-300 hover:shadow-lg overflow-hidden">
      <div className="bg-primary-light dark:bg-primary-dark p-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
      </div>
      <div className="p-6 space-y-3">
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            Question:
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {question}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            Student Answer:
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {answer}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            AI Grading:
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Score: {score}/5
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Feedback: {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExampleCard;
