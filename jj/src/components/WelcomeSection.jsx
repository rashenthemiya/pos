import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const images = [
  "/images/edu1.jpg",
  "/images/edu2.jpg",
  "/images/edu3.jpg",
  "/images/edu4.jpg",
  "/images/edu5.jpg",
  "/images/edu6.jpg",
  "/images/edu7.jpg",
];

const WelcomeSection = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const hexSize = 160;
  const hexGap = 8;
  const rowHeight = hexSize * 0.75 + hexGap;
  const columnWidth = hexSize + hexGap;

  const positions = [
    [0, 0],
    [1, 0],
    [0.5, 1],
    [-0.5, 1],
    [-1, 0],
    [-0.5, -1],
    [0.5, -1],
  ];

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <Helmet>
        <title>Education Empower Sri Lanka | Welcome</title>
      </Helmet>

      {/* Blurred Background */}
      <div className="absolute inset-0 bg-[url('/images/edu5.jpg')] bg-cover bg-center z-0 filter blur-md brightness-30" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-16 text-center">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 drop-shadow-lg mb-6">
            {t("home.welcomeMessage")}
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto text-gray-200 drop-shadow">
            {t("home.description")}
          </p>
        </div>

        {/* Hexagon Grid */}
        <div className="relative w-full h-[700px] mx-auto">
          {positions.map(([x, y], i) => {
            const index = (currentIndex + i) % images.length;
            return (
              <HexagonImage
                key={i}
                src={images[index]}
                size={`${hexSize}px`}
                className="absolute"
                style={{
                  left: `calc(50% + ${x * columnWidth}px)`,
                  top: `calc(50% + ${y * rowHeight}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HexagonImage = ({ src, size = "150px", className = "", style = {} }) => (
  <div
    className={`hexagon transition-transform duration-300 ease-in-out hover:scale-105 ${className}`}
    style={{
      width: size,
      height: size,
      clipPath:
        "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
      position: "absolute",
      backgroundColor: "#fff",
      boxShadow: "0 0 15px rgba(234, 179, 8, 0.4)",
      border: "4px solid #facc15", // Tailwind yellow-400
      overflow: "hidden",
      ...style,
    }}
  >
    <img
      src={src}
      alt="Hexagon"
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
    />
  </div>
);

export default WelcomeSection;
