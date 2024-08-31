import Image from "next/image";

const partners = [
  {
    name: "EduTech Pro",
    logo: "/images/edutech-logo.png",
    link: "https://edutechpro.com",
  },
  {
    name: "TextBook Plus",
    logo: "/images/textbook-logo.png",
    link: "https://textbookplus.com",
  },
  // Add more partners
];

export default function PartnersSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8 text-text-light dark:text-text-dark">
          Our Partners
        </h2>
        <div className="flex justify-center items-center space-x-8">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
