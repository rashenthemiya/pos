import 'font-awesome/css/font-awesome.min.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";

import Contact from "./pages/Contact";
import Login from "./pages/Login";

import AddCustomer from './pages/CustomerManagement/AddCustomer';
import CustomerManagement from './pages/CustomerManagement/CustomerManagement';
import ViewCustomers from './pages/CustomerManagement/ViewCustomers';
import AddProduct from './pages/ProductManagement/AddProduct';
import EditProduct from './pages/ProductManagement/EditProduct';
import ProductManagement from './pages/ProductManagement/ProductManagement';
import ViewProducts from './pages/ProductManagement/ViewProducts';
import AddPublication from './pages/Publications/AddPublication';
import Publication from './pages/Publications/PublicationManagement';
import ViewPublications from './pages/Publications/ViewPublications';
import SalePage from './pages/Sale/SalePage';
// You can create CustomerManagement and ViewCustomers pages similarly

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
                  <Route path="/news/:id" element={<NewsDetail />} />

            <Route path="/contact" element={<Contact />} />
           

            {/* Protected routes */}
            <Route
              path="/admin-dashboard"
              element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
            />
           
           
            <Route path="/product-management" element={<PrivateRoute><ProductManagement /></PrivateRoute>} />
            <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
            <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
            <Route path="/view-products" element={<PrivateRoute><ViewProducts /></PrivateRoute>} />
           
            <Route path="/publication" element={<PrivateRoute><Publication /></PrivateRoute>} />
            <Route path="/add-publication" element={<PrivateRoute><AddPublication /></PrivateRoute>} />
            <Route path="/view-publications" element={<PrivateRoute><ViewPublications /></PrivateRoute>} />

            {/* Customer Management routes */}
            <Route path="/sale" element={<PrivateRoute><SalePage /></PrivateRoute>} />
            <Route path="/customer-management" element={<PrivateRoute><CustomerManagement /></PrivateRoute>} />
            <Route path="/add-customer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
            <Route path="/view-customers" element={<PrivateRoute><ViewCustomers /></PrivateRoute>} />


          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
