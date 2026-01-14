import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, LogOut } from "lucide-react";
import {
  customerMenu,
  oemMenu,
  serviceMenu,
} from "../sidebar/sidebarConfig";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("userRole");

  const menuMap = {
    customer: customerMenu,
    oem: oemMenu,
    service: serviceMenu,
  };

  const menuItems = menuMap[role] || [];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-slate-900 h-screen fixed flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">AUTOMIND</span>
            <p className="text-xs text-slate-500 capitalize">
              {role} Portal
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-1 flex-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                active
                  ? "bg-yellow-400 text-slate-900"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
