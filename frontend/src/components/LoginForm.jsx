import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "", shop_db: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await window.axios.post(
        "http://localhost:3000/api/auth/login",
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
      onLogin(res.data.token, res.data.user, form.shop_db);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Sign In</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Shop DB Name</label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            value={form.shop_db}
            onChange={e => setForm({ ...form, shop_db: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-center text-red-600 bg-red-100 rounded-lg py-2"
          >
            {error}
          </motion.div>
        )}
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
          type="submit"
        >
          Login
        </button>
      </motion.form>
    </div>
  );
}