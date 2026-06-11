'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: { name: string; city: string; state: string };
}

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending:    { bg: '#fef3c7', text: '#92400e' },
  processing: { bg: '#dbeafe', text: '#1e40af' },
  shipped:    { bg: '#e0e7ff', text: '#3730a3' },
  delivered:  { bg: '#dcfce7', text: '#166534' },
  cancelled:  { bg: '#fee2e2', text: '#991b1b' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false); });
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: status as Order['status'] } : o));
      toast.success('Status updated');
    } else {
      toast.error('Failed to update');
    }
    setUpdating(null);
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
          Orders
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 !py-2 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field !w-auto !py-2 text-sm pr-8 cursor-pointer"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Order</th>
              <th className="hidden md:table-cell">Customer</th>
              <th className="hidden sm:table-cell">Items</th>
              <th>Total</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading orders…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No orders found</td></tr>
            ) : filtered.map((order) => (
              <>
                <tr key={order._id} className="cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <td>
                    <span className="font-mono text-sm font-semibold" style={{ color: 'var(--forest)' }}>
                      #{order.orderNumber}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    <div>
                      <p className="text-sm font-medium">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td>
                    <span className="font-bold text-sm" style={{ color: 'var(--forest)' }}>${order.total.toFixed(2)}</span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className="text-xs font-semibold px-2 py-1 rounded cursor-pointer border-0 outline-none"
                      style={{
                        background: STATUS_STYLES[order.status]?.bg || '#f3f4f6',
                        color: STATUS_STYLES[order.status]?.text || '#374151',
                      }}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td className="hidden md:table-cell text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <span className="text-gray-400 text-xs select-none">{expanded === order._id ? '▲' : '▼'}</span>
                  </td>
                </tr>

                {expanded === order._id && (
                  <tr key={`${order._id}-detail`}>
                    <td colSpan={7} style={{ background: 'var(--cream)', padding: 0 }}>
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Line items */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--forest)' }}>Items ordered</p>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t pt-2 flex justify-between text-sm font-bold">
                              <span>Total</span>
                              <span style={{ color: 'var(--forest)' }}>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        {/* Shipping */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--forest)' }}>Ship to</p>
                          <p className="text-sm text-gray-700">
                            {order.shippingAddress?.name}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
