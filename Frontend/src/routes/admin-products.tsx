import { createFileRoute } from "@tanstack/react-router";
import { Shield, ShoppingBag, Package, Users, LayoutDashboard, TrendingUp, Settings, Menu, X, Plus, Edit, Trash2, Search, Upload, X as XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

export const Route = createFileRoute("/admin-products")({
  head: () => ({
    meta: [{ title: "Products — Treadly Admin" }, { name: "description", content: "Manage products in Treadly admin panel" }],
  }),
  component: AdminProducts,
});


type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  collection: string;
  img: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
};

function resolveImageUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function AdminProducts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    category: "popular",
    collection: "sneaker",
    isBestSeller: false,
    isNewArrival: false,
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products?limit=100`);
      const json = await response.json();
      if (!json.success) throw new Error(json.message || "Failed to load products");

      const mapped: AdminProduct[] = json.data.products.map((product: AdminProduct & { img: string }) => ({
        id: product.id,
        name: product.name,
        brand: product.brand || "",
        price: product.price,
        category: product.category || "popular",
        collection: product.collection || "sneaker",
        img: product.img,
        isBestSeller: Boolean(product.isBestSeller),
        isNewArrival: Boolean(product.isNewArrival),
      }));
      setProducts(mapped);
    } catch (error) {
      console.error("Load products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const uploadData = new FormData();
        uploadData.append("file", file);

        const response = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: uploadData,
        });

        const json = await response.json();
        if (!response.ok || !json.success) {
          throw new Error(json.message || "Upload failed");
        }

        setUploadedImageUrl(json.data.imageUrl);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image. Please try again.");
        setImagePreview(editingProduct ? resolveImageUrl(editingProduct.img) : null);
        setUploadedImageUrl(null);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setImagePreview(resolveImageUrl(product.img));
    setUploadedImageUrl(null);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      category: product.category,
      collection: product.collection,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setFormData({
      name: "",
      brand: "",
      price: "",
      category: "popular",
      collection: "sneaker",
      isBestSeller: false,
      isNewArrival: false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Delete failed");
      }
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-neutral-900 text-white transition"
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
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Products</h1>
            <p className="text-neutral-600 mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-orange-500 transition"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-black/5 mb-6">
          <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-2">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-neutral-600">Loading products...</div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden group">
              <div className="relative aspect-square bg-[#f4f4f4]">
                <img
                  src={resolveImageUrl(product.img) || product.img}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-full bg-white shadow-lg hover:bg-neutral-100 transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-full bg-white shadow-lg hover:bg-red-50 text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{product.brand}</p>
                <h3 className="font-semibold mt-1 line-clamp-1">{product.name}</h3>
                <p className="font-extrabold mt-2">₹{product.price}</p>
                <div className="flex gap-2 mt-2">
                  {product.isBestSeller && (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Best Seller</span>
                  )}
                  {product.isNewArrival && (
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">New</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-black/10 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 transition"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Product Image</label>
                  <div className="border-2 border-dashed border-black/10 rounded-2xl p-6 text-center hover:border-neutral-900 transition">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-contain mx-auto"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('file-input')?.click();
                            }}
                            className="p-2 rounded-full bg-white shadow-lg hover:bg-neutral-100 transition"
                            title="Change image"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                              setUploadedImageUrl(null);
                            }}
                            className="p-2 rounded-full bg-white shadow-lg hover:bg-red-50 text-red-600 transition"
                            title="Remove image"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">Click image or edit icon to change</p>
                      </div>
                    ) : (
                      <div className="cursor-pointer" onClick={() => document.getElementById('file-input')?.click()}>
                        <Upload className="h-12 w-12 mx-auto text-neutral-400 mb-2" />
                        <p className="text-sm text-neutral-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-neutral-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Enter brand"
                      className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price"
                      className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="children">Children</option>
                      <option value="popular">Popular</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Collection</label>
                  <select 
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    className="w-full px-4 py-3 rounded-full bg-[#f4f4f4] outline-none focus:ring-2 focus:ring-neutral-900 transition"
                  >
                    <option value="sneaker">Sneaker</option>
                    <option value="running">Running</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-neutral-900" 
                    />
                    <span className="text-sm">Best Seller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-neutral-900" 
                    />
                    <span className="text-sm">New Arrival</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-full bg-[#f4f4f4] font-medium hover:bg-neutral-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setSaving(true);
                        const finalImageUrl = uploadedImageUrl || editingProduct?.img || null;

                        if (!finalImageUrl) {
                          alert("Please upload a product image.");
                          setSaving(false);
                          return;
                        }

                        const productData = {
                          name: formData.name,
                          brand: formData.brand,
                          price: parseInt(formData.price) || 0,
                          category: formData.category,
                          collection: formData.collection,
                          img: finalImageUrl,
                          isBestSeller: formData.isBestSeller,
                          isNewArrival: formData.isNewArrival,
                        };

                        const response = await fetch(`${API_URL}/api/products`, {
                          method: editingProduct ? "PUT" : "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(
                            editingProduct
                              ? { id: editingProduct.id, ...productData }
                              : productData,
                          ),
                        });

                        const json = await response.json();
                        if (!response.ok || !json.success) {
                          throw new Error(json.message || "Save failed");
                        }

                        await loadProducts();
                        setIsModalOpen(false);
                      } catch (error) {
                        console.error("Save error:", error);
                        alert("Failed to save product. Please try again.");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={uploading || saving}
                    className="flex-1 px-6 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-orange-500 transition disabled:opacity-60"
                  >
                    {uploading ? "Uploading..." : saving ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
