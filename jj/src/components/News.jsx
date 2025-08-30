import {
  Bell,
  Calendar,
  List,
  Megaphone,
  Newspaper,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
// Icons
const icons = {
  all: <List className="w-5 h-5" />,
  notice: <Megaphone className="w-5 h-5" />,
  announcement: <Bell className="w-5 h-5" />,
  news: <Newspaper className="w-5 h-5" />,
  event: <Calendar className="w-5 h-5" />,
};

// Blue theme styles
const typeColors = {
  notice: "border-blue-300 bg-blue-50 text-blue-700",
  announcement: "border-blue-400 bg-blue-100 text-blue-800",
  news: "border-blue-500 bg-blue-100 text-blue-900",
  event: "border-blue-600 bg-blue-50 text-blue-800",
  default: "border-blue-300 bg-blue-50 text-blue-700",
};

const EducationCenterHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
    const navigate = useNavigate(); // Add this


  const getUniqueItems = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await api.get("/api/publications");
        const uniqueItems = getUniqueItems(res.data);
        setHighlights(uniqueItems);
        setFiltered(uniqueItems.slice(0, 2)); // only top 2 by default
      } catch (err) {
        console.error("Failed to fetch highlights", err);
      }
    };
    fetchHighlights();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFiltered(highlights.slice(0, 2));
    } else {
      const filteredData = highlights
        .filter((item) => item.type === activeTab)
        .slice(0, 2);
      setFiltered(filteredData);
    }
  }, [activeTab, highlights]);

  const getCardClasses = (type) => {
    return typeColors[type] || typeColors.default;
  };

 const HighlightCard = ({ item }) => (
    <div
      onClick={() => navigate(`/news/${item.id}`)}
      className={`rounded-xl p-5 border shadow-md w-full flex flex-col justify-between transition transform hover:scale-105 hover:shadow-xl hover:bg-gray-100 cursor-pointer duration-300 ${getCardClasses(item.type)}`}
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.topic}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <div className="flex items-center gap-2 mb-2">
        {icons[item.type] || icons["all"]}
        <span className="capitalize font-semibold">{item.type}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.topic}</h3>
      <p className="text-gray-700 text-sm">{item.description}</p>
    </div>
  );


  return (
    <section className="bg-blue-50 py-8 px-4 md:px-6 w-full">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
        Education Center Highlights
      </h2>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 flex-wrap mb-6">
        {["all", "notice", "announcement", "news", "event"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition ${
              activeTab === type
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
            }`}
          >
            {icons[type]}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      {/* Highlights Display */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No highlights found.</p>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          {filtered.map((item) => (
            <div key={item.id} className="w-full max-w-xl">
              <HighlightCard item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EducationCenterHighlights;
