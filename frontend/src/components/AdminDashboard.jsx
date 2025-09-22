
import Sidebar from "./Sidebar";

export default function AdminDashboard({ user, token, shop_db, onLogout }) {
  if (!user) return null;

    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar className="w-64 flex-shrink-0" />
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-lg text-gray-700">Welcome to the admin dashboard! Use the sidebar to navigate.</p>
            {/* Add dashboard widgets or stats here */}
          </div>
        </main>
      </div>
    );
}