'use client';
import { useState, useEffect } from 'react';
import { Package, ShoppingBag, DollarSign, Users, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
}
interface Product {
  _id: string;
  name: string;
  stock: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/products?limit=100').then((r) => r.json()),
    ]).then(([ordersData, productsData]) => {
      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const stats = [
    { label: 'Total revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: '#dcfce7', iconColor: '#166534' },
    { label: 'Total orders', value: orders.length, icon: ShoppingBag, color: '#dbeafe', iconColor: '#1e40af' },
    { label: 'Products', value: products.length, icon: Package, color: '#fef3c7', iconColor: '#92400e' },
    { label: 'Pending orders', value: pendingOrders, icon: TrendingUp, color: '#fce7f3', iconColor: '#9d174d' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">GreenLeaf Organics overview</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary !py-2 !px-4 !text-xs">
          <Plus size={14} /> Add product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className="bg-white rounded-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--forest)' }}>{loading ? '—' : value}</p>
              </div>
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: color }}>
                <Icon size={16} style={{ color: iconColor }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white border border-gray-100 rounded-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold" style={{ color: 'var(--forest)' }}>Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold hover:underline" style={{ color: 'var(--moss)' }}>
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-5 text-sm text-gray-400">Loading...</div>
            ) : orders.slice(0, 5).map((order) => (
              <div key={order._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.items[0]?.name.split(' ').slice(0, 3).join(' ')}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: 'var(--forest)' }}>${order.total.toFixed(2)}</p>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: order.status === 'delivered' ? '#dcfce7' : '#fef3c7', color: order.status === 'delivered' ? '#166534' : '#92400e' }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white border border-gray-100 rounded-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold" style={{ color: 'var(--forest)' }}>
              Low stock alerts {lowStock > 0 && <span className="badge badge-amber ml-2">{lowStock}</span>}
            </h2>
            <Link href="/admin/products" className="text-xs font-semibold hover:underline" style={{ color: 'var(--moss)' }}>
              Manage
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-5 text-sm text-gray-400">Loading...</div>
            ) : products.filter((p) => p.stock <= 10).slice(0, 5).map((product) => (
              <div key={product._id} className="p-4 flex items-center justify-between">
                <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${product.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {product.stock} left
                </span>
              </div>
            ))}
            {!loading && products.filter((p) => p.stock <= 10).length === 0 && (
              <p className="p-5 text-sm text-gray-400">All products are well-stocked 🌱</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
