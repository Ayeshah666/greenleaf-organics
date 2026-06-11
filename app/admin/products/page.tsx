'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  featured: boolean;
  badge?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = () => {
    fetch('/api/products?limit=100')
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  };

  useEffect(fetchProducts, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } else {
      toast.error('Failed to delete');
    }
    setDeleting(null);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
            Products
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary !py-2 !px-4 !text-xs">
          <Plus size={14} /> Add product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 !py-2 text-sm"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Product</th>
              <th className="hidden md:table-cell">Category</th>
              <th className="hidden sm:table-cell">Price</th>
              <th>Stock</th>
              <th className="hidden md:table-cell">Featured</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No products found</td></tr>
            ) : filtered.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-sm overflow-hidden flex-shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</p>
                      {product.badge && <span className="badge badge-green text-xs">{product.badge}</span>}
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell">
                  <span className="text-sm text-gray-600">{product.category}</span>
                </td>
                <td className="hidden sm:table-cell">
                  <span className="font-semibold text-sm" style={{ color: 'var(--forest)' }}>${product.price.toFixed(2)}</span>
                </td>
                <td>
                  <span className={`text-sm font-semibold ${product.stock <= 5 ? 'text-red-600' : product.stock <= 15 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="hidden md:table-cell">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${product.featured ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {product.featured ? '✓' : '—'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${product._id}`}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      disabled={deleting === product._id}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
