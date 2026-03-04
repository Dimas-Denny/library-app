import React from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import UserTable from "@/components/admin/UserTable";
import AdminBookListPage from "@/pages/admin/AdminBookListPage";
import { useLocation } from "react-router-dom";
import AdminBorrowedListPage from "@/pages/admin/AdminBorrowedListPage";

export default function AdminDashboard() {
  const location = useLocation();

  const [activeTab, setActiveTab] = React.useState<
    "BORROWED" | "USER" | "BOOK"
  >("USER");

  React.useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  return (
    <div className="px-4 md:px-16 py-8 space-y-8">
      <AdminTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "USER" && <UserTable />}
      {activeTab === "BOOK" && <AdminBookListPage />}
      {activeTab === "BORROWED" && <AdminBorrowedListPage />}
    </div>
  );
}
