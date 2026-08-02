import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';

<<<<<<< HEAD
// Admin Components
import { AdminProvider } from './contexts/AdminContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import Settings from './pages/admin/Settings';
import NotFound from './pages/admin/NotFound';
import Orders from './pages/admin/Orders';
import Categories from './pages/admin/Categories';
import Customers from './pages/admin/Customers';
import Analytics from './pages/admin/Analytics';

const router = createBrowserRouter([
  // Public client website routes
=======
const router = createBrowserRouter([
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "products", element: <Products /> },
      { path: "contact", element: <Contact /> }
    ]
<<<<<<< HEAD
  },

  // Admin login (public)
  { path: "/admin/login", element: <Login /> },

  // Protected Admin routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "orders", element: <Orders /> },
      { path: "categories", element: <Categories /> },
      { path: "customers", element: <Customers /> },
      { path: "analytics", element: <Analytics /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <NotFound /> }
    ]
  },

  // Fallback 404
  {
    path: "*",
    element: <NotFound />
=======
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
  }
]);

function App() {
<<<<<<< HEAD
  return (
    <AdminProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AdminProvider>
  );
=======
  return <RouterProvider router={router} />;
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
}

export default App;
