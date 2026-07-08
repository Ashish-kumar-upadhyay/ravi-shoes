import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, ShoppingBag, Package, Users, LayoutDashboard, TrendingUp, Settings, Menu, X, Search, Filter, Eye, Download, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin-orders")({
  head: () =>
    buildPageMeta({
      title: "Admin Orders — Luxury Shoes",
      description: "Manage orders.",
      path: "/admin-orders",
      noindex: true,
    }),
  component: AdminOrders,
});

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: ShoppingBag, label: "Orders", active: true },
  { icon: Package, label: "Products", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: TrendingUp, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const orders = [
  { id: "#ORD-001", customer: "Ravi Kumar", email: "ravi@email.com", product: "Air M32 Pro Runner", amount: "₹5,600", status: "Delivered", date: "2025-01-15", items: 1 },
  { id: "#ORD-002", customer: "Priya Singh", email: "priya@email.com", product: "Nike Zoom Fly", amount: "₹11,200", status: "Processing", date: "2025-01-15", items: 2 },
  { id: "#ORD-003", customer: "Amit Patel", email: "amit@email.com", product: "Volt Neon Racer", amount: "₹5,600", status: "Shipped", date: "2025-01-14", items: 1 },
  { id: "#ORD-004", customer: "Sneha Reddy", email: "sneha@email.com", product: "NB Fresh Foam", amount: "₹5,600", status: "Pending", date: "2025-01-14", items: 1 },
  { id: "#ORD-005", customer: "Vikram Sharma", email: "vikram@email.com", product: "Court Retro '92", amount: "₹16,800", status: "Delivered", date: "2025-01-13", items: 3 },
  { id: "#ORD-006", customer: "Neha Gupta", email: "neha@email.com", product: "Adidas Cloudfoam", amount: "₹3,900", status: "Processing", date: "2025-01-13", items: 1 },
  { id: "#ORD-007", customer: "Rahul Verma", email: "rahul@email.com", product: "Hoka Volt Trail", amount: "₹6,200", status: "Shipped", date: "2025-01-12", items: 1 },
  { id: "#ORD-008", customer: "Pooja Mehta", email: "pooja@email.com", product: "Asics Gel Streak", amount: "₹4,800", status: "Delivered", date: "2025-01-12", items: 1 },
];

function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#efeeea] font-sans">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-neutral-600 hover:bg-[#f4f4f4] transition"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-orders"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-neutral-900 text-white transition"
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
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Orders</h1>
            <p className="text-neutral-600 mt-1">Manage and track all orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white ring-1 ring-black/10 hover:bg-neutral-50 transition">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-neutral-600 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-extrabold mt-2">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-neutral-600 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-extrabold mt-2 text-orange-500">{orders.filter(o => o.status === "Pending").length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-neutral-600 uppercase tracking-wider">Processing</p>
            <p className="text-3xl font-extrabold mt-2 text-blue-500">{orders.filter(o => o.status === "Processing").length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-neutral-600 uppercase tracking-wider">Delivered</p>
            <p className="text-3xl font-extrabold mt-2 text-green-500">{orders.filter(o => o.status === "Delivered").length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-2">
              <Search className="h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-full bg-[#f4f4f4] text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-black/5 hover:bg-[#f4f4f4] transition">
                    <td className="py-4 px-6 text-sm font-bold">{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-xs text-neutral-500">{order.email}</p>
                      </div>
                    </td>
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
                    <td className="py-4 px-6">
                      <button className="p-2 rounded-full hover:bg-neutral-100 transition">
                        <Eye className="h-4 w-4 text-neutral-600" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-neutral-100 transition">
                        <MoreHorizontal className="h-4 w-4 text-neutral-600" />
                      </button>
                    </td>
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
