import { useState } from "react";
import {
    FaBars,
    FaBox,
    FaClipboardList,
    FaHandHoldingUsd,
    FaHome,
    FaMoneyBill,
    FaSignOutAlt,
    FaTimes,
    FaTruck,
    FaUserFriends,
    FaUsers,
    FaWarehouse
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
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

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate("/"); // Navigate to home page after logout
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={`bg-gray-900 text-white transition-all duration-300 ${isExpanded ? "w-64" : "w-16"} fixed md:relative top-0 left-0 h-full z-50 flex flex-col hidden md:flex`}>
                <button className="text-white p-4 focus:outline-none hover:bg-gray-700 transition md:flex items-center justify-center" onClick={toggleSidebar}>
                    {isExpanded ? <FaTimes size={24} /> : <FaBars size={24} />}
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
                {/* Logout Button */}
                <ConfirmWrapper onConfirm={handleLogout} message={"Are you sure you want to logout?"}>
                    <button
                        className="flex items-center p-2 mt-auto hover:bg-red-600 transition rounded-lg text-white w-full text-left"
                    >
                        <span className="text-xl ml-4 mr-4"><FaSignOutAlt /></span>
                        <span className={`transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}>Logout</span>
                    </button>
                </ConfirmWrapper>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="bg-gray-900 text-white fixed bottom-0 left-0 w-full flex justify-around p-2 md:hidden z-50">
                {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} className="flex flex-col items-center">
                        <span className="text-xl">{item.icon}</span>
                    </Link>
                ))}
                {/* Mobile Logout */}
                <ConfirmWrapper onConfirm={handleLogout} message={"Are you sure you want to logout?"}>
                    <button className="flex flex-col items-center text-red-500">
                        <span className="text-xl"><FaSignOutAlt /></span>
                    </button>
                </ConfirmWrapper>
            </div>
        </>
    );
};

export default Sidebar;
