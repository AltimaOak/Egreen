import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';

// Admin Components
import { AdminProvider } from './contexts/AdminContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import HomepageEditor from './pages/admin/HomepageEditor';
import AboutEditor from './pages/admin/AboutEditor';
import ContactEditor from './pages/admin/ContactEditor';
import Settings from './pages/admin/Settings';
import NotFound from './pages/admin/NotFound';

// New Redesigned Admin Modules
import Orders from './pages/admin/Orders';
import Categories from './pages/admin/Categories';
import Customers from './pages/admin/Customers';
import Pages from './pages/admin/Pages';
import Analytics from './pages/admin/Analytics';

const router = createBrowserRouter([
  // Public client website routes
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "products", element: <Products /> },
      { path: "contact", element: <Contact /> }
    ]
  },

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
      { path: "pages", element: <Pages /> },
      { path: "analytics", element: <Analytics /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <NotFound /> }
    ]
  },

  // Fallback 404
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return (
    <AdminProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AdminProvider>
  );
}

export default App;
