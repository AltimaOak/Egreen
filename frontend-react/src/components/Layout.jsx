import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
};

export default Layout;
