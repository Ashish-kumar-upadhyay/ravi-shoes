import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Users, ShoppingBag, Package, LogOut, LayoutDashboard, TrendingUp, Settings, Menu, X, DollarSign, Repeat2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";

import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin-dashboard")({
  head: () =>
    buildPageMeta({
      title: "Admin Dashboard — Luxury Shoes",
      description: "Admin dashboard.",
      path: "/admin-dashboard",
      noindex: true,
    }),
  component: AdminDashboard,
});

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ShoppingBag, label: "Orders", active: false },
  { icon: Package, label: "Products", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: TrendingUp, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const stats = [
  { label: "Total Revenue", value: "₹2,45,890", icon: DollarSign, color: "bg-green-500", change: "+12.5%", positive: true },
  { label: "Total Orders", value: "1,234", icon: ShoppingBag, color: "bg-blue-500", change: "+8.2%", positive: true },
  { label: "Repeat Orders", value: "456", icon: Repeat2, color: "bg-purple-500", change: "+5.1%", positive: true },
  { label: "Total Customers", value: "892", icon: Users, color: "bg-orange-500", change: "-2.3%", positive: false },
  { label: "Products", value: "156", icon: Package, color: "bg-pink-500", change: "+3.8%", positive: true },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Ravi Kumar", product: "Air M32 Pro Runner", amount: "₹5,600", status: "Delivered", date: "2025-01-15" },
  { id: "#ORD-002", customer: "Priya Singh", product: "Nike Zoom Fly", amount: "₹5,600", status: "Processing", date: "2025-01-15" },
  { id: "#ORD-003", customer: "Amit Patel", product: "Volt Neon Racer", amount: "₹5,600", status: "Shipped", date: "2025-01-14" },
  { id: "#ORD-004", customer: "Sneha Reddy", product: "NB Fresh Foam", amount: "₹5,600", status: "Pending", date: "2025-01-14" },
  { id: "#ORD-005", customer: "Vikram Sharma", product: "Court Retro '92", amount: "₹5,600", status: "Delivered", date: "2025-01-13" },
];

const topProducts = [
  { name: "Air M32 Pro Runner", sales: 234, revenue: "₹1,31,040", image: "/shoe-red.png" },
  { name: "Nike Zoom Fly", sales: 189, revenue: "₹1,05,840", image: "/shoe-white.png" },
  { name: "Volt Neon Racer", sales: 156, revenue: "₹87,360", image: "/shoe-yellow.png" },
  { name: "Court Retro '92", sales: 145, revenue: "₹81,200", image: "/shoe-retro.png" },
];

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#efeeea] font-sans">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg ring-1 ring-black/10"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-black/10">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-neutral-900" />
            <div>
              <h1 className="font-display text-xl font-bold">Treadly</h1>
              <p className="text-xs text-neutral-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="/admin-dashboard"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition ${
                  true
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-[#f4f4f4]"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-orders"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-neutral-600 hover:bg-[#f4f4f4] transition"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">Orders</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-products"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-neutral-600 hover:bg-[#f4f4f4] transition"
              >
                <Package className="h-5 w-5" />
                <span className="font-medium">Products</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-analytics"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-neutral-600 hover:bg-[#f4f4f4] transition"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Analytics</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-settings"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-neutral-600 hover:bg-[#f4f4f4] transition"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-neutral-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-[#f4f4f4]">
                  <stat.icon className="h-6 w-6 text-neutral-900" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-neutral-600 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Revenue Overview</h2>
              <select className="px-4 py-2 rounded-full bg-[#f4f4f4] text-sm outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 45, 75, 50, 85, 60, 70, 80, 55, 90, 65, 75].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-neutral-900 to-neutral-600 rounded-t-lg transition-all hover:from-orange-500 hover:to-orange-300"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-neutral-500">{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-neutral-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="font-display text-xl font-bold mb-6">Top Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f4f4f4] transition">
                  <div className="w-12 h-12 rounded-lg bg-[#f4f4f4] flex items-center justify-center">
                    <Package className="h-6 w-6 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.sales} sales</p>
                  </div>
                  <p className="font-bold text-sm">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold">Recent Orders</h2>
            <Link to="/" className="text-sm text-neutral-600 hover:text-neutral-900">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10 bg-[#f4f4f4]">
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Order ID</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Customer</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Product</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Amount</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-black/5 hover:bg-[#f4f4f4] transition">
                    <td className="py-4 px-6 text-sm font-bold">{order.id}</td>
                    <td className="py-4 px-6 text-sm">{order.customer}</td>
                    <td className="py-4 px-6 text-sm">{order.product}</td>
                    <td className="py-4 px-6 text-sm font-bold">{order.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                        order.status === "Shipped" ? "bg-purple-100 text-purple-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-neutral-600">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
