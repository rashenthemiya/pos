import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axiosInstance";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get(`/api/publications/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Failed to fetch news detail", err);
      }
    };

    fetchNews();
  }, [id]);

  if (!news) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">{news.topic}</h1>
      {news.image && (
        <img
          src={news.image}
          alt={news.topic}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <p className="text-gray-700 text-lg">{news.description}</p>
    </div>
  );
};

export default NewsDetail;
