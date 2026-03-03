import React from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import UserTable from "@/components/admin/UserTable";
import AdminBookListPage from "@/pages/admin/AdminBookListPage";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState<
    "BORROWED" | "USER" | "BOOK"
  >("USER");

  return (
    <div className="px-4 md:px-16 py-8 space-y-8">
      <AdminTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "USER" && <UserTable />}

      {activeTab === "BOOK" && <AdminBookListPage />}

      {activeTab === "BORROWED" && (
        <div className="bg-white rounded-2xl p-10 shadow text-center text-black/50">
          Coming Soon
        </div>
      )}
    </div>
  );
}
