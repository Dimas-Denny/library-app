import { NavLink } from "react-router-dom";

export default function ProfileTabs() {
  const base = "px-6 py-2 rounded-full text-sm font-medium transition";

  return (
    <div className="flex justify-center">
      <div className="flex gap-2 bg-black/5 p-1 rounded-full">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${base} ${
              isActive ? "bg-white shadow text-black" : "text-black/60"
            }`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/borrowed-list"
          className={({ isActive }) =>
            `${base} ${
              isActive ? "bg-white shadow text-black" : "text-black/60"
            }`
          }
        >
          Borrowed List
        </NavLink>

        <NavLink
          to="/reviews"
          className={({ isActive }) =>
            `${base} ${
              isActive ? "bg-white shadow text-black" : "text-black/60"
            }`
          }
        >
          Reviews
        </NavLink>
      </div>
    </div>
  );
}
