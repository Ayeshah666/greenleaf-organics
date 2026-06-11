'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Package, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}
interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#fef3c7',
  processing: '#dbeafe',
  shipped: '#e0e7ff',
  delivered: '#dcfce7',
  cancelled: '#fee2e2',
};
const STATUS_TEXT: Record<string, string> = {
  pending: '#92400e',
  processing: '#1e40af',
  shipped: '#3730a3',
  delivered: '#166534',
  cancelled: '#991b1b',
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="section-eyebrow mb-2">My account</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
            Welcome back, {user.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          {user.role === 'admin' && (
            <Link href="/admin" className="btn-outline !py-2 !px-3 !text-xs">Admin Panel</Link>
          )}
          <button onClick={handleLogout} className="btn-outline !py-2 !px-3 !text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-gray-100 rounded-sm p-5 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{ background: 'var(--moss)' }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.role === 'admin' && (
            <span className="badge badge-green mt-1">Admin</span>
          )}
        </div>
        <User size={16} className="ml-auto text-gray-300" />
      </div>

      {/* Orders */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Package size={18} style={{ color: 'var(--moss)' }} />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
            Order history
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-sm animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-sm">
            <Package size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold mb-1">No orders yet</p>
            <p className="text-sm text-gray-500 mb-4">Your orders will show up here once placed.</p>
            <Link href="/products" className="btn-primary !text-xs">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-100 rounded-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--forest)' }}>
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge text-xs" style={{ background: STATUS_COLORS[order.status] || '#f3f4f6', color: STATUS_TEXT[order.status] || '#374151' }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-bold" style={{ color: 'var(--forest)' }}>${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {order.items.map((i) => `${i.name.split(' ').slice(0, 3).join(' ')} ×${i.quantity}`).join(' · ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
