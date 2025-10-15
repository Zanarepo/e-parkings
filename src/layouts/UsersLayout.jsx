import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
 ParkingCircle,
  Clock,
  LogOut,
  Car,
  Building2,
  Home,
  Users,
  Wallet,
  Settings,
  Menu,
  Bell,
} from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function UsersLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // desktop toggle
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // mobile overlay toggle
  const [notifications, setNotifications] = useState(3);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    else {
      setUser({
        id: 1,
        full_name: "John Doe",
        email: "john@example.com",
        profile_image: "",
        user_type: "both",
      });
    }
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileSidebarOpen(false); // auto-close on mobile after navigation
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [{ title: "Home", path: "/", icon: Home }];

  if (user.user_type === "driver" || user.user_type === "both") {
    navigationItems.push(
      { title: "Driver Dashboard", path: "/dashboard/driver", icon: Car },
      //{ title: "Scan QR Code", path: "/dashboard/scan-qr", icon: QrCode },
      { title: "My Bookings", path: "/dashboard/bookings", icon: Clock },
      { title: "My Wallet", path: "/dashboard/wallet", icon: Wallet }
    );
  }

  if (user.user_type === "operator" || user.user_type === "both") {
    navigationItems.push(
      { title: "Operator Dashboard", path: "/dashboard/operator", icon: LayoutDashboard },
      { title: "Add Parking Space", path: "/dashboard/add-parkingspace", icon: PlusCircle },
      { title: "My Spaces", path: "/dashboard/my-spaces", icon: Building2 },
      { title: "Invite Manager", path: "/dashboard/invite", icon: Users },
      { title: "Admin Dashboard", path: "/dashboard/admin", icon: Settings }
    );
  }

  navigationItems.push({ title: "Profile Settings", path: "/dashboard/profile", icon: Settings });

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-emerald-50 to-yellow-50 overflow-hidden relative">

        {/* ✅ MOBILE TOPBAR */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-emerald-200 flex items-center justify-between px-4 py-3 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
          <h2 className="font-bold text-emerald-700 text-lg">SmartPark</h2>
        </div>

        {/* ✅ SIDEBAR - shared for desktop + mobile */}
        <div
          className={`
            bg-white border-r border-emerald-200 flex flex-col transition-all duration-300 
            ${isSidebarOpen ? "md:w-64" : "md:w-20"} 
            md:static md:translate-x-0
            fixed top-0 left-0 h-full z-50 w-64
            transform ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          `}
        >
          {/* Sidebar Header */}
          <SidebarHeader className="border-b border-emerald-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <ParkingCircle className="w-6 h-6 text-white" />
              </div>
              {isSidebarOpen && (
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">SmartPark</h2>
                  <p className="text-xs text-emerald-600">Smart City Parking</p>
                </div>
              )}
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-700" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {notifications}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu className="w-5 h-5 text-gray-700" />
              </Button>
            </div>

            {/* Mobile close button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)}>
                ✕
              </Button>
            </div>
          </SidebarHeader>

          {/* Sidebar Content */}
          <SidebarContent className="flex-1 overflow-y-auto p-2">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => handleNavigation(item.path)}
                        className={`hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 rounded-xl mb-1 w-full ${
                          isActive(item.path)
                            ? "bg-emerald-100 text-emerald-700 font-semibold"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {isSidebarOpen && <span>{item.title}</span>}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Footer */}
          <div className="border-t border-emerald-200 bg-white">
            <Separator className="border-emerald-200" />
            <SidebarFooter className="p-3">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.profile_image} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                    {user.full_name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isSidebarOpen && (
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                )}
              </div>

              {isSidebarOpen && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:bg-red-50 h-8 text-xs"
                  onClick={handleLogout}
                >
                  <LogOut className="w-3 h-3 mr-2" />
                  Logout
                </Button>
              )}
            </SidebarFooter>
          </div>
        </div>

        {/* ✅ Optional dim background when sidebar open on mobile */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
        )}

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col overflow-hidden md:ml-0 mt-12 md:mt-0">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
