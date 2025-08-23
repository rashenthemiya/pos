import RegisterForm from "./RegisterForm";

export default function AdminDashboard({ user, token, shop_db, onLogout }) {
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto pt-12 pb-4">
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, <span className="text-indigo-600">{user.username}</span> <span className="text-fuchsia-700">({user.role})</span>
          </h3>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
        {user.role === "manager" || user.role === "admin" ? (
          <RegisterForm token={token} shop_db={shop_db} />
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg text-center mt-8">
            Only managers or admins can register new users.
          </div>
        )}
      </div>
    </div>
  );
}