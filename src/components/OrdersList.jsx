// OrdersList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ShoppingBagIcon,
    MapPinIcon,
    PhoneIcon,
    CreditCardIcon,
    CurrencyRupeeIcon,
    UserIcon,
    XMarkIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersPagination, setOrdersPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        currentPage: 1,
        limit: 5,
    });
    const [ordersFilters, setOrdersFilters] = useState({
        status: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [selectedOrder, setSelectedOrder] = useState(null);

    // FINAL BULLETPROOF PAYMENT METHOD DETECTION
    const getPaymentMethod = (order) => {
        if (!order) return 'Unknown';

        const method = (order.paymentMethod || '').toString().trim().toLowerCase();

        // Direct match (most common)
        if (method.includes('cod')) return 'Cash on Delivery';
        if (method.includes('upi')) return 'UPI';
        if (method.includes('card')) return 'Credit/Debit Card';

        // Fallback from paymentDetails (for older orders)
        if (order.paymentDetails?.cardLast4) return 'Credit/Debit Card';
        if (order.paymentDetails?.upiId) return 'UPI';

        // Super defensive fallback
        if (order.paymentStatus === 'paid' && !order.paymentDetails?.upiId && !order.paymentDetails?.cardLast4) {
            return 'Prepaid (Card/UPI)';
        }

        return 'Cash on Delivery'; // final safety net — never show "Other"
    };

    // Updated icon function
    const getPaymentIcon = (method) => {
        if (!method) return null;
        if (method.includes('Cash on Delivery')) return <TruckIcon className="h-6 w-6 text-red-500" />;
        if (method.includes('UPI')) return <span className="text-3xl font-black text-red-500">UPI</span>;
        if (method.includes('Card')) return <CreditCardIcon className="h-6 w-6 text-red-500" />;
        return <TruckIcon className="h-6 w-6 text-gray-500" />;
    };

    useEffect(() => {
        fetchOrders(1);
    }, [ordersFilters]);

    const fetchOrders = async (page = 1) => {
        setOrdersLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(ordersPagination.limit || 5),
                ...(ordersFilters.status && { status: ordersFilters.status }),
                ...(ordersFilters.search && { search: ordersFilters.search }),
                sortBy: ordersFilters.sortBy,
                sortOrder: ordersFilters.sortOrder,
            });

            const { data } = await axios.get(`${API_URL}/api/orders?${params}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            const resOrders = data.orders || data.data || [];
            setOrders(resOrders);
            setOrdersPagination({
                page: data.page || page,
                pages: data.pages || data.totalPages || 1,
                total: data.total || data.count || resOrders.length,
                currentPage: data.page || page,
                limit: data.limit || 5,
            });
        } catch (err) {
            console.error('Fetch orders error:', err.response?.data || err);
            toast.error('Failed to load orders');
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleOrdersFilterChange = (key, value) => {
        setOrdersFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleOrdersPageChange = (page) => {
        if (!page || page < 1 || page > ordersPagination.pages) return;
        fetchOrders(page);
    };

    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('delivered')) return 'text-green-400 bg-green-900/30';
        if (s.includes('processing') || s.includes('confirmed')) return 'text-blue-400 bg-blue-900/30';
        if (s.includes('shipped')) return 'text-purple-400 bg-purple-900/30';
        if (s.includes('cancelled')) return 'text-red-400 bg-red-900/30';
        return 'text-yellow-400 bg-yellow-900/30';
    };

    const formatAddress = (addr) => {
        if (!addr) return 'Not provided';
        const parts = [
            addr.address || addr.street,
            addr.city,
            addr.state,
            addr.pincode,
        ].filter(Boolean);
        return parts.length ? parts.join(', ') : 'Not provided';
    };

    const btnPrimary = 'px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-xl shadow-lg transition';
    const btnSecondary = 'px-6 py-3 border border-red-800 text-red-400 hover:bg-red-900/20 rounded-xl transition font-medium';

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-red-500">Your Orders</h2>
                    <p className="text-gray-400 mt-2">
                        {ordersPagination.total > 0
                            ? `Tracking ${ordersPagination.total} order${ordersPagination.total > 1 ? 's' : ''}`
                            : 'No orders placed yet'}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-zinc-900 border border-red-900/30 rounded-2xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={ordersFilters.search}
                                onChange={(e) => handleOrdersFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-red-900/50 rounded-xl focus:border-red-600 outline-none transition"
                            />
                        </div>

                        <select
                            value={ordersFilters.status}
                            onChange={(e) => handleOrdersFilterChange('status', e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-red-900/50 rounded-xl focus:border-red-600 outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={ordersFilters.sortBy}
                            onChange={(e) => handleOrdersFilterChange('sortBy', e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-red-900/50 rounded-xl focus:border-red-600 outline-none"
                        >
                            <option value="createdAt">Order Date</option>
                            <option value="totalAmount">Amount</option>
                        </select>

                        <select
                            value={ordersFilters.sortOrder}
                            onChange={(e) => handleOrdersFilterChange('sortOrder', e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-red-900/50 rounded-xl focus:border-red-600 outline-none"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Loading / Empty */}
                {ordersLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin h-16 w-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <ShoppingBagIcon className="h-20 w-20 text-gray-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-300">No Orders Yet</h3>
                        <p className="text-gray-500 mt-3">Start shopping and your orders will appear here</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-zinc-900/80 border border-red-900/30 rounded-2xl p-6 hover:border-red-800/60 transition-all duration-300">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Order #{order.orderNumber || order._id.slice(-8)}</h3>
                                            <p className="text-sm text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                                                {order.status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Pending'}
                                            </span>
                                            <p className="text-2xl font-black text-red-500 mt-2">
                                                ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        {(order.items || []).slice(0, 4).map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <img
                                                    src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                                                    alt={item.product?.name}
                                                    className="w-16 h-16 rounded-lg object-cover border border-red-900/30"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-300 truncate">{item.product?.name || 'Product'}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex gap-4">
                                        <button onClick={() => setSelectedOrder(order)} className={btnSecondary}>
                                            View Details
                                        </button>
                                        {order.status === 'delivered' && (
                                            <button className={btnPrimary}>Reorder</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {ordersPagination.pages > 1 && (
                            <div className="mt-10 flex justify-center gap-2">
                                <button
                                    onClick={() => handleOrdersPageChange(ordersPagination.currentPage - 1)}
                                    disabled={ordersPagination.currentPage === 1}
                                    className="p-3 rounded-xl bg-zinc-900 border border-red-900/30 disabled:opacity-50 hover:bg-red-900/20 transition"
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>
                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(5, ordersPagination.pages) }, (_, i) => {
                                        const page = ordersPagination.currentPage <= 3
                                            ? i + 1
                                            : ordersPagination.currentPage >= ordersPagination.pages - 2
                                                ? ordersPagination.pages - 4 + i
                                                : ordersPagination.currentPage - 2 + i;
                                        if (page < 1 || page > ordersPagination.pages) return null;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handleOrdersPageChange(page)}
                                                className={`px-4 py-2 rounded-xl font-medium transition ${page === ordersPagination.currentPage
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-zinc-900 border border-red-900/30 hover:bg-red-900/20'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => handleOrdersPageChange(ordersPagination.currentPage + 1)}
                                    disabled={ordersPagination.currentPage === ordersPagination.pages}
                                    className="p-3 rounded-xl bg-zinc-900 border border-red-900/30 disabled:opacity-50 hover:bg-red-900/20 transition"
                                >
                                    <ChevronRightIcon className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* ORDER DETAILS MODAL - NOW WITH ICONS */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-zinc-950 border border-red-900/40 rounded-2xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
                            <div className="sticky top-0 bg-zinc-950 border-b border-red-900/30 p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-red-500">Order Details</h2>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-red-900/20 rounded-xl transition">
                                    <XMarkIcon className="h-7 w-7 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                    <div className="bg-zinc-900/50 border border-red-900/30 rounded-xl p-4">
                                        <p className="text-gray-400 text-sm">Order ID</p>
                                        <p className="font-mono text-lg text-white">#{selectedOrder.orderNumber || selectedOrder._id.slice(-8)}</p>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-red-900/30 rounded-xl p-4">
                                        <p className="text-gray-400 text-sm">Total Amount</p>
                                        <p className="text-2xl font-black text-red-500">₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-red-900/30 rounded-xl p-4">
                                        <p className="text-gray-400 text-sm">Status</p>
                                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status?.replace(/-/g, ' ').toUpperCase() || 'PENDING'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                        <ShoppingBagIcon className="h-6 w-6 text-red-500" />
                                        Items Ordered
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedOrder.items?.map((item, i) => (
                                            <div key={i} className="flex gap-4 bg-zinc-900 p-4 rounded-xl">
                                                <img
                                                    src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                                                    alt={item.product?.name}
                                                    className="w-24 h-24 rounded-lg object-cover border border-red-900/30"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-white">{item.product?.name || 'Product'}</h4>
                                                    <p className="text-sm text-gray-400 mt-1">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                                                </div>
                                                <p className="text-xl font-bold text-red-500">
                                                    ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                            <MapPinIcon className="h-6 w-6 text-red-500" />
                                            Delivery Address
                                        </h3>
                                        <div className="bg-zinc-900 p-5 rounded-xl space-y-3">
                                            <p className="flex items-center gap-3"><UserIcon className="h-5 w-5 text-red-400" /> {selectedOrder.shippingAddress?.fullName}</p>
                                            <p className="flex items-center gap-3"><PhoneIcon className="h-5 w-5 text-red-400" /> {selectedOrder.shippingAddress?.phone}</p>
                                            <p className="flex items-start gap-3"><MapPinIcon className="h-5 w-5 text-red-400 mt-1" /> {formatAddress(selectedOrder.shippingAddress)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                            <CreditCardIcon className="h-6 w-6 text-red-500" />
                                            Payment Info
                                        </h3>
                                        <div className="bg-zinc-900 p-5 rounded-xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Method:</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-red-400">{getPaymentIcon(getPaymentMethod(selectedOrder))}</span>
                                                    <strong className="text-white text-lg">{getPaymentMethod(selectedOrder)}</strong>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Status:</span>
                                                <strong className={selectedOrder.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}>
                                                    {selectedOrder.paymentStatus || 'Pending'}
                                                </strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Transaction ID:</span>
                                                <code className="text-xs bg-black/50 px-2 py-1 rounded">{selectedOrder.paymentId || 'N/A'}</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button onClick={() => setSelectedOrder(null)} className={btnSecondary}>
                                        Close
                                    </button>
                                    {selectedOrder.status === 'delivered' && (
                                        <button className={btnPrimary}>Reorder Items</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersList;