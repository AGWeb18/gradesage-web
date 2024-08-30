import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ExampleCard from "./components/ExampleCard";
import PricingSection from "./components/PricingComponent";
import Features from "./components/Features";
import HeroComponent from "./components/HeroComponent";

export default function Home() {
  const examples = [
    {
      title: "Short Answer: Biology",
      question: "Explain the process of photosynthesis.",
      answer:
        "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide to produce glucose and oxygen.",
      score: 3,
      feedback:
        "Good basic explanation. Include the role of chlorophyll and mention that it occurs in chloroplasts for a more complete answer.",
    },
    {
      title: "Essay: Literature",
      question: "Analyze the theme of ambition in Macbeth.",
      answer:
        "Macbeth's ambition leads him to commit murder and become king. His wife also shows ambition by encouraging him. This ambition ultimately leads to their downfall.",
      score: 3,
      feedback:
        "Strong main points. Consider exploring how ambition corrupts Macbeth's character and include specific examples from the play to support your analysis.",
    },
    {
      title: "Presentation: Business",
      question: "Present a SWOT analysis for a startup e-commerce company.",
      answer:
        "Strengths: Innovative product, low overhead. Weaknesses: Limited budget, new brand. Opportunities: Growing online market, social media marketing. Threats: Established competitors, economic uncertainty.",
      score: 4,
      feedback:
        "Good overview of SWOT elements. To improve, provide brief explanations for each point and consider adding one more item per category for a more comprehensive analysis.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        <HeroComponent />

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-text-light dark:text-text-dark mb-6">
            GradeSage AI in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <ExampleCard key={index} {...example} />
            ))}
          </div>
        </section>

        <Features />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
