import Header from "../components/Header";
import FeedbackThankYouContent from "../components/FeedbackThankYouContent";

export default function FeedbackThankYou() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <FeedbackThankYouContent />
    </div>
  );
}
