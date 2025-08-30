import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const AddProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({ sku: "", name: "", unit: "", category: "", brand: "" });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { name, role } = useAuth();

    console.log("Logged in user:", name, "Role:", role);

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setImage(e.target.files[0]);
        } else {
            setProduct({ ...product, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("sku", product.sku);
        formData.append("name", product.name);
        formData.append("unit", product.unit);
        formData.append("category", product.category);
        formData.append("brand", product.brand);
        if (image) formData.append("image", image);

        try {
            await api.post("/api/items", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setShowSuccess(true);
            setProduct({ sku: "", name: "", unit: "", category: "", brand: "" });
            setImage(null);
        } catch (err) {
            console.error("Error adding item:", err);
            setError(err.response?.data?.message || "An error occurred while adding the item.");
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
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>

                {showSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
                        ✅ Product added successfully!
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
                        name="sku"
                        placeholder="SKU (unique)"
                        value={product.sku}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Item Name"
                        value={product.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="unit"
                        placeholder="Unit (e.g. kg, liters, packets, bottles)"
                        value={product.unit}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={product.category}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        value={product.brand}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <ConfirmWrapper
                        open={showConfirm}
                        message="Confirm Item Addition"
                        additionalInfo="Double check item details and image before submitting."
                        confirmText="Yes, Add Item"
                        cancelText="No, Go Back"
                        icon={<FiPlusCircle />}
                        buttonBackgroundColor="bg-blue-600"
                        buttonTextColor="text-white"
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
                            {loading ? "Adding..." : "Add Item"}
                        </button>
                    </ConfirmWrapper>
                    <button
                        type="button"
                        onClick={() => navigate("/product-management")}
                        className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
