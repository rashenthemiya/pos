import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import api from "../../lib/api";

const SalePage = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([]); // [{item_id, name, qty, price, subtotal}]
  const [searchItem, setSearchItem] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [total, setTotal] = useState(0);
  const [paid, setPaid] = useState(0);
  const [change, setChange] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch customers from backend
  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(() => setCustomers([]));
  }, []);

  // On page load, fetch all items once
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    api.get('/items')
      .then(res => {
        setAllProducts(res.data);
        setProducts(res.data);
      })
      .catch(() => {
        setAllProducts([]);
        setProducts([]);
      });
  }, []);

  // When user types, filter items on frontend only
  useEffect(() => {
    if (searchItem.trim() === "") {
      setProducts(allProducts);
    } else {
      const q = searchItem.trim().toLowerCase();
      setProducts(
        allProducts.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (String(p.item_id) === q)
        )
      );
    }
  }, [searchItem, allProducts]);

  // Debug: log searchItem and products
  useEffect(() => {
    console.log("searchItem:", searchItem);
    console.log("products:", products);
  }, [searchItem, products]);

  // Add item to bill
  const addItem = (product) => {
    const exists = items.find(i => i.item_id === product.item_id);
    if (exists) {
      setItems(items.map(i => i.item_id === product.item_id ? { ...i, qty: i.qty + 1, subtotal: (i.qty + 1) * i.price } : i));
    } else {
      setItems([...items, { ...product, qty: 1, subtotal: product.price }]);
    }
  };

  // Remove item from bill
  const removeItem = (item_id) => {
    setItems(items.filter(i => i.item_id !== item_id));
  };

  // Update totals
  const updateTotals = () => {
    const t = items.reduce((sum, i) => sum + i.subtotal, 0);
    setTotal(t);
    setChange(paid - (t - discount));
  };

  // Update totals when items, paid, or discount change
  useEffect(() => {
    updateTotals();
  }, [items, paid, discount]);

  // Finalize Sale (send to backend)
  const handleFinalizeSale = async () => {
    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }
    if (!selectedCustomer) {
      toast.error("Select a customer");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        customer_id: selectedCustomer,
        items: items.map(i => ({ item_id: i.item_id, qty: i.qty, price: i.price })),
        payment_method: paid < total - discount ? "loan" : "cash",
        paid_amount: paid,
        discount: discount,
      };
      await api.post("/orders", payload);
      toast.success("Order placed successfully");
      setItems([]);
      setPaid(0);
      setDiscount(0);
      setSelectedCustomer("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="p-8 w-full overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Sales / Billing</h1>
        {/* Customer Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Select Customer</label>
          <input
            type="text"
            placeholder="Search customer..."
            value={searchCustomer}
            onChange={e => setSearchCustomer(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <select
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">-- Select Customer --</option>
            {customers.filter(c => c.name?.toLowerCase().includes(searchCustomer.toLowerCase())).map(c => (
              <option key={c.customer_id} value={c.customer_id}>{c.name}</option>
            ))}
          </select>
        </div>
        {/* Item Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Add Item</label>
          <input
            type="text"
            placeholder="Search item..."
            value={searchItem}
            onChange={e => setSearchItem(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {products.length === 0 && searchItem.trim() !== "" && (
              <span className="text-gray-500">No items found</span>
            )}
            {products.map(p => (
              <button key={p.item_id} className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => addItem(p)}>
                {p.name} {p.sku ? `(${p.sku})` : ''} ${p.price ?? 0}
              </button>
            ))}
          </div>
        </div>
        {/* Bill Table */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Bill</h2>
          <table className="min-w-full mb-2">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-1">Item</th>
                <th className="px-2 py-1">Qty</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">Subtotal</th>
                <th className="px-2 py-1">Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.item_id}>
                  <td className="px-2 py-1">{i.name}</td>
                  <td className="px-2 py-1">{i.qty}</td>
                  <td className="px-2 py-1">{i.price}</td>
                  <td className="px-2 py-1">{i.subtotal}</td>
                  <td className="px-2 py-1">
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeItem(i.item_id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold text-lg">Total: ${total}</div>
        </div>
        {/* Discount */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Discount</label>
          <input
            type="number"
            value={discount}
            onChange={e => setDiscount(Number(e.target.value))}
            className="p-2 border rounded w-full"
          />
        </div>
        {/* Payment Section */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Paid Amount</label>
          <input
            type="number"
            value={paid}
            onChange={e => setPaid(Number(e.target.value))}
            className="p-2 border rounded w-full"
          />
          <div className="text-right font-bold text-lg">Change: ${change}</div>
        </div>
        {/* Finalize Sale Button */}
        <button
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          onClick={handleFinalizeSale}
          disabled={loading}
        >
          {loading ? "Processing..." : "Finalize Sale"}
        </button>
      </div>
    </div>
  );
};

export default SalePage;
