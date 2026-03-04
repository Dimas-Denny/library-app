import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

type Props = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  // fallback dari localStorage (penting untuk production)
  const savedUser = localStorage.getItem("user");
  const localUser = savedUser ? JSON.parse(savedUser) : null;

  const role = user?.role ?? localUser?.role;

  if (!token && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
