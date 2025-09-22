import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const ViewCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const shopDb = localStorage.getItem("shop_db");
        const response = await api.get("/customers", {
          headers: { "x-shop-db": shopDb }
        });
        setCustomers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch customers.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">View All Customers</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : customers.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No customers found.</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">NIC</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Shop Balance</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.customer_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{customer.customer_id}</td>
                  <td className="px-6 py-4">{customer.name}</td>
                  <td className="px-6 py-4">{customer.nic}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.shop_balance}</td>
                  <td className="px-6 py-4">{customer.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={() => navigate("/add-customer")}
          className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Add Customer
        </button>
      </div>
    </div>
  );
};

export default ViewCustomers;
