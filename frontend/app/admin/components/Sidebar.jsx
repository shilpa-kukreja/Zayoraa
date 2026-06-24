"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiTag,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiPlus,   
  FiVideo,
  
  FiList
} from "react-icons/fi";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/admin/admindashboard", icon: FiHome },
  { 
    name: "Users", 
    href: "/admin/all-users", 
    icon: FiUsers,
  },
  { 
    name: "Products", 
    icon: FiBox,
    submenu: [
      { name: "List Products", href: "/admin/list-product", icon: FiList },
      { name: "Add Product", href: "/admin/add-product", icon: FiPlus }
    ]
  },
  { 
    name: "Categories", 
    icon: FiTag,
    submenu: [
      { name: "List Categories", href: "/admin/list-categories", icon: FiList },
      { name: "Add Category", href: "/admin/add-categories", icon: FiPlus }
    ]
  },
   { 
    name: "Videos", 
    icon:  FiVideo,
    submenu: [
      { name: "List Videos", href: "/admin/list-videos", icon: FiList },
      { name: "Add Videos", href: "/admin/add-videos", icon: FiPlus }
    ]
  },
  { 
    name: "Coupons", 
    icon:  FiTag,
    submenu: [
      { name: "List Coupons", href: "/admin/list-coupon", icon: FiList },
      { name: "Add Coupons", href: "/admin/add-coupon", icon: FiPlus }
    ]
  },
  {
    name: "blogs",
    icon: FiBox,
    submenu: [
      { name: "List Blogs", href: "/admin/list-blog", icon: FiList },
      { name: "Add Blog", href: "/admin/add-blogs", icon: FiPlus }
    ]
  },
   { name: "Contacts", href: "/admin/admin-contact", icon: FiUsers },
   { name: "Subscribers", href: "/admin/admin-subscriber", icon: FiUsers },

   {name: "Orders", href: "/admin/all-orders", icon: FiBox},
  { name: "Orders Support", href: "/admin/list-support", icon: FiUsers },

  // { name: "Analytics", href: "/admin/analytics", icon: FiBarChart2 },
  // { name: "Settings", href: "/admin/settings", icon: FiSettings },
   
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (name) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white hidden md:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-20 flex items-center justify-start pl-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white tracking-wide">
          Admin<span className="text-blue-400">Panel</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const hasSubmenu = item.submenu;
          const isSubmenuOpen = openSubmenus[item.name];
          
          // Check if any submenu item is active
          const isSubmenuItemActive = hasSubmenu && 
            item.submenu.some(subItem => pathname === subItem.href);

          return (
            <div key={item.name}>
              {hasSubmenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isSubmenuItemActive
                        ? "bg-blue-500/20 text-white"
                        : "text-gray-300 hover:bg-gray-750 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`text-lg ${
                          isSubmenuItemActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                        }`}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {isSubmenuOpen ? (
                      <FiChevronDown className="text-sm transition-transform duration-300" />
                    ) : (
                      <FiChevronRight className="text-sm transition-transform duration-300" />
                    )}
                  </button>
                  
                  {isSubmenuOpen && (
                    <div className="ml-4 pl-6 border-l border-gray-700 space-y-2 mt-2">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isActive = pathname === subItem.href;
                        
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                              isActive
                                ? "text-blue-400 bg-blue-500/10"
                                : "text-gray-400 hover:text-white hover:bg-gray-750/50"
                            }`}
                          >
                            <SubIcon className="text-sm" />
                            <span className="text-sm">{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-750 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`text-lg ${
                      active ? "text-white" : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-gray-750">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-gray-400 truncate">admin@example.com</p>
          </div>
        </div>
        
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
          }}
        >
          <FiLogOut className="text-lg transform group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}