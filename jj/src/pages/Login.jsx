
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "", shop_db: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const res = await axios.post(
        `${apiUrl}/auth/login`,
        {
          username: form.username,
          password: form.password,
          shop_db: form.shop_db
        },
        {
          headers: {
            "x-shop-db": form.shop_db,
            "Content-Type": "application/json"
          }
        }
      );
      // Save token and user info as needed
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Login failed. Error object:", err);
      if (err.response) {
        console.error("Backend error response:", err.response);
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
        console.error("Headers:", err.response.headers);
      } else if (err.request) {
        console.error("No response received. Request object:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="w-full max-w-md rounded-lg shadow-xl bg-white p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Login</h2>
        {error && <div className="mb-4 text-center text-red-600 bg-red-100 rounded-lg py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Shop DB Name</label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={form.shop_db}
              onChange={e => setForm({ ...form, shop_db: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
