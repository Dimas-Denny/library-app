import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

type Props = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  // 🚫 belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 bukan admin
  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
