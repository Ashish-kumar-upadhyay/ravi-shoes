import { createFileRoute } from "@tanstack/react-router";
import { Shield, ShoppingBag, Package, Users, LayoutDashboard, TrendingUp, Settings, Menu, X, User, Bell, Lock, Globe, CreditCard, Save, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin-settings")({
  head: () =>
    buildPageMeta({
      title: "Admin Settings — Luxury Shoes",
      description: "Manage settings.",
      path: "/admin-settings",
      noindex: true,
    }),
  component: AdminSettings,
});

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: ShoppingBag, label: "Orders", active: false },
  { icon: Package, label: "Products", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: TrendingUp, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: true },
];

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "store", label: "Store Settings", icon: Globe },
  { id: "payment", label: "Payment", icon: CreditCard },
];

function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1500);
  };

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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-neutral-600 hover:bg-[#f4f4f4] transition"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Analytics</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-settings"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-neutral-900 text-white transition"
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
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-neutral-600 mt-1">Manage your account and store settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <ul className="space-y-2">
                {settingsSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition ${
                        activeSection === section.id
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-600 hover:bg-[#f4f4f4]"
                      }`}
                    >
                      <section.icon className="h-5 w-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeSection === "profile" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
                      <User className="h-10 w-10 text-neutral-400" />
                    </div>
                    <div>
                      <button className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-orange-500 transition">
                        Change Photo
                      </button>
                      <p className="text-xs text-neutral-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">First Name</label>
                      <input
                        type="text"
                        defaultValue="Admin"
                        className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Last Name</label>
                      <input
                        type="text"
                        defaultValue="User"
                        className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Email</label>
                    <input
                      type="email"
                      defaultValue="admin@treadly.com"
                      className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-orange-500 transition disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: "New order notifications", description: "Get notified when new orders are placed" },
                    { label: "Low stock alerts", description: "Alert when product stock is low" },
                    { label: "Customer reviews", description: "Notify when customers leave reviews" },
                    { label: "Daily sales report", description: "Receive daily sales summary" },
                    { label: "Marketing emails", description: "Receive marketing and promotional emails" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#f4f4f4]">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-neutral-600">{item.description}</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-neutral-900 relative transition">
                        <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Current Password</label>
                    <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="flex-1 bg-transparent outline-none"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-neutral-500 hover:text-neutral-900"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">New Password</label>
                    <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="flex-1 bg-transparent outline-none"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-neutral-500 hover:text-neutral-900"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-orange-500 transition disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "store" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold mb-6">Store Settings</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Store Name</label>
                    <input
                      type="text"
                      defaultValue="Treadly"
                      className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Store Description</label>
                    <textarea
                      defaultValue="Best fabric selection, personalized creativity, and innovative solutions to clothe you always."
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Currency</label>
                    <select className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Timezone</label>
                    <select className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition">
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-orange-500 transition disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "payment" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold mb-6">Payment Settings</h2>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-[#f4f4f4]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-neutral-900" />
                        <div>
                          <p className="font-medium">Stripe Integration</p>
                          <p className="text-sm text-neutral-600">Accept payments via Stripe</p>
                        </div>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-neutral-900 relative transition">
                        <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Stripe Publishable Key"
                        className="w-full px-4 py-2 rounded-full bg-white outline-none text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Stripe Secret Key"
                        className="w-full px-4 py-2 rounded-full bg-white outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f4f4f4]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-neutral-900" />
                        <div>
                          <p className="font-medium">Razorpay Integration</p>
                          <p className="text-sm text-neutral-600">Accept payments via Razorpay</p>
                        </div>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-neutral-300 relative transition">
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">COD Availability</label>
                    <select className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition">
                      <option>Available</option>
                      <option>Not Available</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-orange-500 transition disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
