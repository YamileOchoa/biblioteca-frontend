import AdminHeader from "../components/AdminHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ backgroundColor: "#F2F7FF", minHeight: "100vh" }}>
      <AdminHeader />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
