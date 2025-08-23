import { useState } from "react";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";
import axios from "axios";
window.axios = axios;

export default function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [shop_db, setShopDb] = useState("");

  function handleLogin(token, user, shop_db) {
    setToken(token);
    setUser(user);
    setShopDb(shop_db);
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    setShopDb("");
  }

  return (
    <div>
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <AdminDashboard user={user} token={token} shop_db={shop_db} onLogout={handleLogout} />
      )}
    </div>
  );
}