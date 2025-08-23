import { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterForm({ token, shop_db }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    role: "",
    email: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await window.axios.post(
        "http://localhost:3000/api/auth/register",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-shop-db": shop_db,
            "Content-Type": "application/json"
          }
        }
      );
      setSuccess(res.data.message || "User registered successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex items-center justify-center min-h-[70vh]"
    >
      <form
        className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-fuchsia-700">Register User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              type="text" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              type="text" value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Role</label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required>
              <option value="">Select role</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              type="text" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-4 text-center text-red-600 bg-red-100 rounded-lg py-2"
          >{error}</motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-4 text-center text-green-600 bg-green-100 rounded-lg py-2"
          >{success}</motion.div>
        )}
        <button
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-2 rounded-lg transition-colors"
          type="submit"
        >Register</button>
      </form>
    </motion.div>
  );
}