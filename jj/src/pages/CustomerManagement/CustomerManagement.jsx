import { Eye, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const CustomerManagement = () => {
    const navigate = useNavigate();
    const { name, role } = useAuth();

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="p-8 w-full overflow-auto">
                <div className="text-3xl font-semibold mb-8">
                    <h1>Customer Management</h1>
                    <p className="text-lg text-gray-500">Manage your customers effectively</p>
                </div>

                {/* Customer Management Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">

                    {/* Add New Customer */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><PlusCircle className="mr-2 text-blue-600" />Add New Customer</h2>
                        <p className="text-gray-700 mb-4">Add a new customer to your records.</p>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
                            onClick={() => navigate("/add-customer")}
                        >
                            Add Customer
                        </button>
                    </div>

                    {/* View All Customers */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><Eye className="mr-2 text-green-600" />View All Customers</h2>
                        <p className="text-gray-700 mb-4">View a complete list of your customers.</p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
                            onClick={() => navigate("/view-customers")}
                        >
                            View Customers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagement;
