import { useState } from "react";
import { useTranslation } from "react-i18next";

const FeatureCards = () => {
  const [clickedIndex, setClickedIndex] = useState(null);
  const { t } = useTranslation();

  const handleCardClick = (index) => {
    setClickedIndex(index);
  };

  const features = [
    {
      icon: "🎓",
      value: t("featureCards.studentsValue"),
      label: t("featureCards.studentsLabel"),
    },
    {
      icon: "👨‍🏫",
      value: t("featureCards.teachersValue"),
      label: t("featureCards.teachersLabel"),
    },
    {
      icon: "👪",
      value: t("featureCards.parentsValue"),
      label: t("featureCards.parentsLabel"),
    },
    {
      icon: "🏫",
      value: t("featureCards.schoolsValue"),
      label: t("featureCards.schoolsLabel"),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-20 px-10">
      <div className="container mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Column (75%): Rectangular Cards Grid */}
        <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer p-6 bg-white border-2 rounded-2xl shadow-md transition-all duration-300 ${
                clickedIndex === index
                  ? "border-blue-500 shadow-lg scale-105"
                  : "border-transparent hover:border-blue-300"
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl">{item.icon}</div>
                <div className="text-2xl font-bold text-blue-900">{item.value}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (25%): Text */}
        <div className="md:w-1/4 flex items-center justify-center text-center">
          <div className="text-blue-800 space-y-4">
            <h2 className="text-2xl font-bold">
              {t("featureCards.sideTitle", "Thousands of hands lifting up education")} 🙌
            </h2>
            <p className="text-gray-700">
              {t("featureCards.sideText", "Join a growing community transforming learning across Sri Lanka.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
