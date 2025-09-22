import { useState } from "react";
import { FaBox, FaClipboardList, FaHandHoldingUsd, FaHome, FaMoneyBill, FaSignOutAlt, FaTruck, FaUserFriends, FaUsers, FaWarehouse } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmWrapper from "./ConfirmWrapper";

const getMenuItems = (role) => [
    { path: "/admin-dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/product-management", icon: <FaBox />, label: "Products" },
    { path: "/customers", icon: <FaUserFriends />, label: "Customers" },
    { path: "/orders", icon: <FaClipboardList />, label: "Orders" },
    { path: "/payments", icon: <FaMoneyBill />, label: "Payments" },
    { path: "/withdrawals", icon: <FaHandHoldingUsd />, label: "Withdrawals" },
    { path: "/suppliers", icon: <FaTruck />, label: "Suppliers" },
    { path: "/stock", icon: <FaWarehouse />, label: "Stock" },
    ...(role === "manager" || role === "admin" ? [
        { path: "/users", icon: <FaUsers />, label: "Users" }
    ] : [])
];

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { logout, role } = useAuth();
    const navigate = useNavigate();
    const menuItems = getMenuItems(role);

    const toggleSidebar = () => setIsExpanded((prev) => !prev);
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className={`bg-gray-900 text-white transition-all duration-300 ${isExpanded ? "w-64" : "w-16"} h-full flex flex-col`}>
            <button className="text-white p-4 focus:outline-none hover:bg-gray-700 transition flex items-center justify-center" onClick={toggleSidebar}>
                {isExpanded ? <FaSignOutAlt size={24} /> : <FaSignOutAlt size={24} />}
            </button>
            <ul className="mt-4 space-y-2 flex-grow">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link to={item.path} className="flex items-center p-2 hover:bg-gray-700 transition rounded-lg">
                            <span className="text-xl ml-4 mr-4">{item.icon}</span>
                            <span className={`transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <ConfirmWrapper onConfirm={handleLogout} message={"Are you sure you want to logout?"}>
                <button className="flex items-center p-2 mt-auto hover:bg-red-600 transition rounded-lg text-white w-full text-left">
                    <span className="text-xl ml-4 mr-4"><FaSignOutAlt /></span>
                    <span className={`transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}>Logout</span>
                </button>
            </ConfirmWrapper>
        </div>
    );
};

export default Sidebar;
