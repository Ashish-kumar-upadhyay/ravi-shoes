import { createFileRoute } from "@tanstack/react-router";
import { Shield, ShoppingBag, Package, Users, LayoutDashboard, TrendingUp, Settings, Menu, X, DollarSign, ArrowUpRight, ArrowDownRight, Calendar, BarChart3, PieChart, Users as UsersIcon } from "lucide-react";
import { useState } from "react";

import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin-analytics")({
  head: () =>
    buildPageMeta({
      title: "Admin Analytics — Luxury Shoes",
      description: "View analytics.",
      path: "/admin-analytics",
      noindex: true,
    }),
  component: AdminAnalytics,
});

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: ShoppingBag, label: "Orders", active: false },
  { icon: Package, label: "Products", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: TrendingUp, label: "Analytics", active: true },
  { icon: Settings, label: "Settings", active: false },
];

const metrics = [
  { label: "Total Revenue", value: "₹2,45,890", change: "+12.5%", positive: true, icon: DollarSign },
  { label: "Total Orders", value: "1,234", change: "+8.2%", positive: true, icon: ShoppingBag },
  { label: "Average Order Value", value: "₹1,995", change: "+3.1%", positive: true, icon: BarChart3 },
  { label: "Conversion Rate", value: "3.2%", change: "-0.5%", positive: false, icon: TrendingUp },
];

const monthlyData = [
  { month: "Jan", revenue: 180000, orders: 120, visitors: 4500 },
  { month: "Feb", revenue: 195000, orders: 135, visitors: 4800 },
  { month: "Mar", revenue: 210000, orders: 145, visitors: 5200 },
  { month: "Apr", revenue: 185000, orders: 130, visitors: 4900 },
  { month: "May", revenue: 225000, orders: 155, visitors: 5500 },
  { month: "Jun", revenue: 245890, orders: 170, visitors: 5800 },
];

const topProducts = [
  { name: "Air M32 Pro Runner", sales: 234, revenue: "₹1,31,040", percentage: 35 },
  { name: "Nike Zoom Fly", sales: 189, revenue: "₹1,05,840", percentage: 28 },
  { name: "Volt Neon Racer", sales: 156, revenue: "₹87,360", percentage: 22 },
  { name: "Court Retro '92", sales: 145, revenue: "₹81,200", percentage: 15 },
];

const customerSegments = [
  { segment: "New Customers", count: 456, percentage: 51, color: "bg-orange-500" },
  { segment: "Returning Customers", count: 312, percentage: 35, color: "bg-blue-500" },
  { segment: "VIP Customers", count: 124, percentage: 14, color: "bg-green-500" },
];

function AdminAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 6 months");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-neutral-900 text-white transition"
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
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Analytics</h1>
            <p className="text-neutral-600 mt-1">Track your store performance and growth</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-full bg-white ring-1 ring-black/10 text-sm outline-none"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-[#f4f4f4]">
                  <metric.icon className="h-6 w-6 text-neutral-900" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-extrabold">{metric.value}</p>
                <p className="text-sm text-neutral-600 mt-1">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="font-display text-xl font-bold mb-6">Revenue Overview</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-neutral-900 to-neutral-600 rounded-t-lg transition-all hover:from-orange-500 hover:to-orange-300 relative group"
                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    ₹{(data.revenue / 1000).toFixed(0)}K
                  </div>
                </div>
                <span className="text-xs font-medium text-neutral-600">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold mb-6">Top Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f4f4f4] flex items-center justify-center">
                        <Package className="h-5 w-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-neutral-500">{product.sales} sales</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm">{product.revenue}</p>
                  </div>
                  <div className="h-2 bg-[#f4f4f4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 rounded-full transition-all"
                      style={{ width: `${product.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold mb-6">Customer Segments</h2>
            <div className="space-y-4">
              {customerSegments.map((segment, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${segment.color} bg-opacity-10 flex items-center justify-center`}>
                        <UsersIcon className={`h-5 w-5 ${segment.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{segment.segment}</p>
                        <p className="text-xs text-neutral-500">{segment.count} customers</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm">{segment.percentage}%</p>
                  </div>
                  <div className="h-2 bg-[#f4f4f4] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${segment.color} rounded-full transition-all`}
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Stats Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold mb-6">Monthly Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10 bg-[#f4f4f4]">
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Month</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Revenue</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Orders</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Visitors</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-600">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, i) => (
                  <tr key={i} className="border-b border-black/5 hover:bg-[#f4f4f4] transition">
                    <td className="py-4 px-6 text-sm font-bold">{data.month}</td>
                    <td className="py-4 px-6 text-sm font-bold">₹{data.revenue.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm">{data.orders}</td>
                    <td className="py-4 px-6 text-sm">{data.visitors.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm font-bold">{((data.orders / data.visitors) * 100).toFixed(2)}%</td>
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
