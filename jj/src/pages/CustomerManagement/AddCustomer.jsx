import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import api from "../../utils/axiosInstance";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    nic: "",
    shop_balance: "",
    phone: "",
    email: "",
    address: ""
  });
  const [nicImageFront, setNicImageFront] = useState(null);
  const [nicImageBack, setNicImageBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "nic_image_front") {
      setNicImageFront(e.target.files[0]);
    } else if (e.target.name === "nic_image_back") {
      setNicImageBack(e.target.files[0]);
    } else {
      setCustomer({ ...customer, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    Object.entries(customer).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (nicImageFront) formData.append("nic_image_front", nicImageFront);
    if (nicImageBack) formData.append("nic_image_back", nicImageBack);
    try {
      const shopDb = localStorage.getItem("shop_db");
      await api.post("/customers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-shop-db": shopDb,
        },
      });
      setShowSuccess(true);
      setCustomer({ name: "", nic: "", shop_balance: "", phone: "", email: "", address: "" });
      setNicImageFront(null);
      setNicImageBack(null);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while adding the customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Customer</h2>
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            ✅ Customer added successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={customer.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="nic"
            placeholder="NIC Number"
            value={customer.nic}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            name="shop_balance"
            placeholder="Shop Balance"
            value={customer.shop_balance}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={customer.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <textarea
            name="address"
            placeholder="Address"
            value={customer.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="file"
            name="nic_image_front"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="file"
            name="nic_image_back"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <ConfirmWrapper
            open={showConfirm}
            message="Confirm Customer Addition"
            additionalInfo="Double check customer details and NIC images before submitting."
            confirmText="Yes, Add Customer"
            cancelText="No, Go Back"
            onConfirm={() => {
              setShowConfirm(false);
              handleSubmit();
            }}
            onCancel={() => setShowConfirm(false)}
          >
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Customer"}
            </button>
          </ConfirmWrapper>
          <button
            type="button"
            onClick={() => navigate("/customer-management")}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
