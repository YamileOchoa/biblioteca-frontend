// src/layouts/MainLayout.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServiceBanner from "../components/ServiceBanner";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <ServiceBanner />
      <Footer />
    </>
  );
};

export default MainLayout;
