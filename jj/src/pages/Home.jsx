import {
  BellAlertIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import EducationCenterHighlights from "../components/News";
import ServiceSection from "../components/ServiceSection";
import VisionMission from "../components/VisionMission";
import WelcomeSection from "../components/WelcomeSection";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hasNews = true; // Your actual logic here

  return (
    <div>
      {/* Helmet for SEO */}
      
      <Navbar />

 {/* Welcome + News Grid */}
<div className="grid grid-cols-1 md:grid-cols-10 gap-6 px-4 md:px-12 py-6">
  {/* Welcome Section - 70% */}
  <div className="md:col-span-7">
    <WelcomeSection />
  </div>

  {/* Education Center Highlights - 30% */}
  <div className="hidden md:block md:col-span-3">
    <div className="bg-white rounded-lg shadow-md border-l-4 border-green-600 p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <BellAlertIcon className="h-6 w-6 text-green-700 animate-bounce" />
        <h3 className="text-green-800 font-semibold text-lg">Center News</h3>
      </div>
      <EducationCenterHighlights />
    </div>
  </div>
</div>
{/* Full-width other sections */}

  <FeatureCards />
  <VisionMission />
  <ServiceSection />




      <Footer />

      {/* Mobile: Toggle Button to open news */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-1/3 left-0 z-50 bg-green-600 text-white p-2 rounded-r-lg shadow-md
          transition-all duration-300 hover:bg-green-700 md:hidden
          ${hasNews && !isOpen ? "animate-pulse" : ""}
        `}
      >
        <div className="relative">
          {isOpen ? (
            <ChevronLeftIcon className="h-6 w-6" />
          ) : (
            <ChevronRightIcon className="h-6 w-6" />
          )}
          {hasNews && !isOpen && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
          )}
        </div>
      </button>

      {/* Mobile: Slide-out news panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-white border-r-4 border-green-600 shadow-2xl p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center gap-2 mb-4">
          <BellAlertIcon className="h-6 w-6 text-green-700 animate-bounce" />
          <h3 className="text-green-800 font-semibold text-lg">Center</h3>
        </div>
        <EducationCenterHighlights />
      </div>

      {/* Call Button */}
      <a
        href="tel:+066-2285181"
        className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-700 transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.52l.58 2.32a2 2 0 01-.45 1.86L8.1 10.9a11.05 11.05 0 005.01 5.01l2.2-2.2a2 2 0 011.86-.45l2.32.58A2 2 0 0121 17.72V21a2 2 0 01-2 2h-.28C9.95 23 1 14.05 1 3.28V3a2 2 0 012-2z"
          />
        </svg>
        Call Center
      </a>
    </div>
  );
};

export default Home;
