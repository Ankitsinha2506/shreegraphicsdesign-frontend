// src/pages/Profile.jsx - INDUSTRIAL GRADE PROFESSIONAL (2025)
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  UserIcon,
  ShoppingBagIcon,
  CogIcon,
  HeartIcon,
  PaintBrushIcon,
  SwatchIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

import ProfileInfo from '../components/ProfileInfo';
import OrdersList from '../components/OrdersList';
import LogoRequestsList from '../components/LogoRequestsList';
import EmbroideryRequestsList from '../components/EmbroideryRequestsList';
import CustomDesignOrdersList from '../components/CustomDesignOrdersList';
import FavoritesList from '../components/FavoritesList';
import Settings from '../components/Settings';

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'profile'
  );

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon },
    { id: 'logo-requests', label: 'Logo Design', icon: PaintBrushIcon },
    { id: 'embroidery-requests', label: 'Embroidery', icon: SwatchIcon },
    { id: 'custom-design-orders', label: 'Custom Orders', icon: PhotoIcon },
    { id: 'favorites', label: 'Wishlist', icon: HeartIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileInfo />;
      case 'orders': return <OrdersList />;
      case 'logo-requests': return <LogoRequestsList />;
      case 'embroidery-requests': return <EmbroideryRequestsList />;
      case 'custom-design-orders': return <CustomDesignOrdersList />;
      case 'favorites': return <FavoritesList />;
      case 'settings': return <Settings />;
      default: return <ProfileInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(' ')[0] || 'Shopper'}!
          </h1>
          <p className="mt-3 text-lg text-gray-600">Manage your account, orders & creative requests</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-orange-200 overflow-hidden">

          {/* Tab Bar - Fixed & Beautiful */}
          <div className="border-b border-gray-200 bg-gray-50/80 backdrop-blur">
            <div className="max-w-5xl mx-auto">
              <nav className="flex overflow-x-auto scrollbar-hide px-4 py-2 -mb-px">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-3 ${
                        isActive
                          ? 'text-orange-600 border-orange-600'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-t-full" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-10 bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
            <div className="max-w-5xl mx-auto">
              {renderContent()}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          © 2025 YourBrand • Made with <span className="text-red-600">❤️</span> in India
        </div>
      </div>
    </div>
  );
};

export default Profile;



// import { useState, useEffect } from 'react'
// import { useSearchParams, useLocation } from 'react-router-dom'
// import {
//   UserIcon,
//   ShoppingBagIcon,
//   CogIcon,
//   HeartIcon,
//   PaintBrushIcon,
//   SwatchIcon,
//   PhotoIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon
// } from '@heroicons/react/24/outline'
// import { useAuth } from '../context/AuthContext'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { API_URL } from '../config/api'

// /**
//  * Profile.jsx
//  * Red–Black Premium theme
//  * - All original functionality preserved
//  * - Styling changed to red/black premium look (Tailwind only)
//  */

// const Profile = () => {
//   const { user, updateProfile, logout } = useAuth()
//   const [searchParams] = useSearchParams()
//   const location = useLocation()
//   const [activeTab, setActiveTab] = useState(
//     location.state?.activeTab || searchParams.get('tab') || 'profile'
//   )
//   const [loading, setLoading] = useState(false)

//   const [profileData, setProfileData] = useState({
//     name: user?.name || '',
//     phone: user?.phone || '',
//     address: {
//       street: user?.address?.street || '',
//       city: user?.address?.city || '',
//       state: user?.address?.state || '',
//       pincode: user?.address?.pincode || ''
//     }
//   })

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   })

//   const [orders, setOrders] = useState([])
//   const [ordersLoading, setOrdersLoading] = useState(false)
//   const [ordersPagination, setOrdersPagination] = useState({ page: 1, pages: 1, total: 0, currentPage: 1, limit: 5 })
//   const [ordersFilters, setOrdersFilters] = useState({ status: '', search: '', sortBy: 'createdAt', sortOrder: 'desc' })

//   const [logoRequests, setLogoRequests] = useState([])
//   const [logoRequestsLoading, setLogoRequestsLoading] = useState(false)

//   const [embroideryRequests, setEmbroideryRequests] = useState([])
//   const [embroideryRequestsLoading, setEmbroideryRequestsLoading] = useState(false)

//   const [customDesignOrders, setCustomDesignOrders] = useState([])
//   const [customDesignOrdersLoading, setCustomDesignOrdersLoading] = useState(false)

//   // favorites placeholder (fetch from backend if available)
//   const [favorites, setFavorites] = useState([])

//   const tabs = [
//     { id: 'profile', name: 'Profile', icon: UserIcon },
//     { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
//     { id: 'logo-requests', name: 'Logo Requests', icon: PaintBrushIcon },
//     { id: 'embroidery-requests', name: 'Embroidery Requests', icon: SwatchIcon },
//     { id: 'custom-design-orders', name: 'Custom Design Orders', icon: PhotoIcon },
//     { id: 'favorites', name: 'Favorites', icon: HeartIcon },
//     { id: 'settings', name: 'Settings', icon: CogIcon }
//   ]

//   useEffect(() => {
//     if (location.state?.activeTab) {
//       setActiveTab(location.state.activeTab)
//     }
//   }, [location.state])

//   // Fetch appropriate data on tab change
//   useEffect(() => {
//     if (activeTab === 'orders') {
//       fetchOrders(1)
//     } else if (activeTab === 'logo-requests') {
//       fetchLogoRequests()
//     } else if (activeTab === 'embroidery-requests') {
//       fetchEmbroideryRequests()
//     } else if (activeTab === 'custom-design-orders') {
//       fetchCustomDesignOrders()
//     }
//     // favorites might be fetched elsewhere when user favorites something
//   }, [activeTab])

//   // If ordersFilters change, re-fetch orders (reset to page 1)
//   useEffect(() => {
//     if (activeTab === 'orders') {
//       fetchOrders(1)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ordersFilters])

//   const handleOrdersFilterChange = (key, value) => {
//     setOrdersFilters(prev => ({ ...prev, [key]: value }))
//   }

//   const handleOrdersPageChange = (page) => {
//     if (!page || page < 1 || page > (ordersPagination.pages || 1)) return
//     fetchOrders(page)
//   }

//   const fetchOrders = async (page = 1) => {
//     setOrdersLoading(true)
//     try {
//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(ordersPagination.limit || 5),
//         ...(ordersFilters.status && { status: ordersFilters.status }),
//         ...(ordersFilters.search && { search: ordersFilters.search }),
//         sortBy: ordersFilters.sortBy,
//         sortOrder: ordersFilters.sortOrder
//       })

//       const response = await axios.get(`${API_URL}/api/orders?${params.toString()}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       })

//       // keep compatibility with different response shapes
//       const resOrders = response.data.orders || response.data.data || []
//       const pageInfo = {
//         page: response.data.page || page,
//         pages: response.data.pages || response.data.totalPages || 1,
//         total: response.data.total || response.data.count || resOrders.length,
//         currentPage: response.data.page || page,
//         limit: response.data.limit || ordersPagination.limit
//       }

//       setOrders(resOrders)
//       setOrdersPagination(pageInfo)
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//       toast.error('Failed to fetch orders')
//       setOrders([])
//     } finally {
//       setOrdersLoading(false)
//     }
//   }

//   const fetchLogoRequests = async () => {
//     setLogoRequestsLoading(true)
//     try {
//       const response = await axios.get(`${API_URL}/api/custom-logo-requests/my-requests`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       })
//       const data = response.data.data || response.data.requests || response.data || []
//       setLogoRequests(Array.isArray(data) ? data : [])
//     } catch (error) {
//       console.error('Error fetching logo requests:', error)
//       toast.error('Failed to fetch logo requests')
//       setLogoRequests([])
//     } finally {
//       setLogoRequestsLoading(false)
//     }
//   }

//   const fetchEmbroideryRequests = async () => {
//     setEmbroideryRequestsLoading(true)
//     try {
//       const response = await axios.get(`${API_URL}/api/custom-embroidery-requests/my-requests`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       })
//       const data = response.data.data || []
//       setEmbroideryRequests(Array.isArray(data) ? data : [])
//     } catch (error) {
//       console.error('Error fetching embroidery requests:', error)
//       toast.error('Failed to fetch embroidery requests')
//       setEmbroideryRequests([])
//     } finally {
//       setEmbroideryRequestsLoading(false)
//     }
//   }

//   const fetchCustomDesignOrders = async () => {
//     setCustomDesignOrdersLoading(true)
//     try {
//       const response = await axios.get(`${API_URL}/api/custom-design-orders`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       })
//       const data = response.data.orders || response.data.data || []
//       setCustomDesignOrders(Array.isArray(data) ? data : [])
//     } catch (error) {
//       console.error('Error fetching custom design orders:', error)
//       toast.error('Failed to fetch custom design orders')
//       setCustomDesignOrders([])
//     } finally {
//       setCustomDesignOrdersLoading(false)
//     }
//   }

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       await updateProfile(profileData)
//       toast.success('Profile updated successfully')
//     } catch (error) {
//       console.error('Profile update error:', error)
//       toast.error('Failed to update profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePasswordChange = async (e) => {
//     e.preventDefault()

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast.error('New passwords do not match')
//       return
//     }

//     if (passwordData.newPassword.length < 6) {
//       toast.error('Password must be at least 6 characters')
//       return
//     }

//     setLoading(true)

//     try {
//       await axios.put(`${API_URL}/api/auth/change-password`, {
//         currentPassword: passwordData.currentPassword,
//         newPassword: passwordData.newPassword
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       })

//       toast.success('Password changed successfully')
//       setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to change password'
//       toast.error(message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStatusColor = (status) => {
//     switch ((status || '').toLowerCase()) {
//       case 'delivered':
//         return 'text-green-600 bg-green-100'
//       case 'processing':
//         return 'text-blue-600 bg-blue-100'
//       case 'shipped':
//         return 'text-purple-600 bg-purple-100'
//       case 'cancelled':
//         return 'text-red-600 bg-red-100'
//       default:
//         return 'text-gray-600 bg-gray-100'
//     }
//   }

//   // -- UI helpers (theme classes reused) --
//   const panelBase = 'bg-zinc-950 border border-red-900/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-6'
//   const inputBase = 'w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition'
//   const btnPrimary = 'inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-[0_6px_25px_rgba(255,0,0,0.25)]'
//   const btnSecondary = 'inline-flex items-center justify-center bg-transparent border border-red-800 text-red-300 py-2 px-4 rounded-lg hover:bg-red-900/20 transition'

//   return (
//     <div className="min-h-screen bg-black/80 py-10 text-gray-100">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Page header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-extrabold text-red-400">Your Account</h1>
//               <p className="text-sm text-gray-400">Manage profile, orders and requests</p>
//             </div>
//           </div>
//         </div>

//         <div className={panelBase}>
//           {/* Tabs */}
//           <div className="border-b border-red-900/20 pb-3 mb-6">
//             <nav className="flex gap-3 overflow-auto">
//               {tabs.map(tab => {
//                 const Icon = tab.icon
//                 const active = activeTab === tab.id
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${active ? 'bg-gradient-to-r from-red-800/40 to-red-900/40 text-red-200 shadow-[0_6px_20px_rgba(255,0,0,0.12)]' : 'text-gray-400 hover:bg-red-900/10'}`}
//                   >
//                     <Icon className={`h-5 w-5 ${active ? 'text-red-300' : 'text-gray-400'}`} />
//                     <span>{tab.name}</span>
//                   </button>
//                 )
//               })}
//             </nav>
//           </div>

//           <div>
//             {/* PROFILE */}
//             {activeTab === 'profile' && (
//               <div className="max-w-2xl mx-auto">
//                 <h2 className="text-2xl font-bold text-red-300 mb-6">Profile Information</h2>
//                 <form onSubmit={handleProfileUpdate} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm text-gray-300 block mb-1">Full Name</label>
//                       <input
//                         type="text"
//                         value={profileData.name}
//                         onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
//                         className={inputBase}
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm text-gray-300 block mb-1">Email</label>
//                       <input
//                         type="email"
//                         value={user?.email || ''}
//                         className={`${inputBase} bg-zinc-900/60 cursor-not-allowed`}
//                         disabled
//                         title="Email cannot be changed"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-300 block mb-1">Phone Number</label>
//                     <input
//                       type="tel"
//                       value={profileData.phone}
//                       onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
//                       className={inputBase}
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-300 block mb-1">Street Address</label>
//                     <textarea
//                       value={profileData.address.street}
//                       onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
//                       className={`${inputBase} min-h-[80px]`}
//                       rows={3}
//                       placeholder="Enter your street address"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="text-sm text-gray-300 block mb-1">City</label>
//                       <input
//                         type="text"
//                         value={profileData.address.city}
//                         onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
//                         className={inputBase}
//                         placeholder="City"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-300 block mb-1">State</label>
//                       <input
//                         type="text"
//                         value={profileData.address.state}
//                         onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
//                         className={inputBase}
//                         placeholder="State"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-300 block mb-1">Pincode</label>
//                       <input
//                         type="text"
//                         value={profileData.address.pincode}
//                         onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, pincode: e.target.value } }))}
//                         className={inputBase}
//                         placeholder="Pincode"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button type="submit" disabled={loading} className={btnPrimary}>
//                       {loading ? 'Updating...' : 'Update Profile'}
//                     </button>
//                     <button type="button" onClick={() => setProfileData({
//                       name: user?.name || '',
//                       phone: user?.phone || '',
//                       address: {
//                         street: user?.address?.street || '',
//                         city: user?.address?.city || '',
//                         state: user?.address?.state || '',
//                         pincode: user?.address?.pincode || ''
//                       }
//                     })} className={btnSecondary}>
//                       Reset
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* ORDERS */}
//             {activeTab === 'orders' && (
//               <div>
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-red-300">Order History</h2>
//                     <p className="text-sm text-gray-400 mt-1">{ordersPagination.total > 0 ? `${ordersPagination.total} orders` : 'No orders yet'}</p>
//                   </div>
//                 </div>

//                 {/* Filters */}
//                 <div className="bg-zinc-900 border border-red-900/20 rounded-lg p-4 mb-6">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Search orders..."
//                         value={ordersFilters.search}
//                         onChange={(e) => handleOrdersFilterChange('search', e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                       />
//                       <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-2.5" />
//                     </div>

//                     <select
//                       value={ordersFilters.status}
//                       onChange={(e) => handleOrdersFilterChange('status', e.target.value)}
//                       className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                     >
//                       <option value="">All Statuses</option>
//                       <option value="pending">Pending</option>
//                       <option value="confirmed">Confirmed</option>
//                       <option value="in-progress">In Progress</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>

//                     <select
//                       value={ordersFilters.sortBy}
//                       onChange={(e) => handleOrdersFilterChange('sortBy', e.target.value)}
//                       className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                     >
//                       <option value="createdAt">Date</option>
//                       <option value="totalAmount">Amount</option>
//                       <option value="status">Status</option>
//                     </select>

//                     <select
//                       value={ordersFilters.sortOrder}
//                       onChange={(e) => handleOrdersFilterChange('sortOrder', e.target.value)}
//                       className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                     >
//                       <option value="desc">Newest First</option>
//                       <option value="asc">Oldest First</option>
//                     </select>
//                   </div>
//                 </div>

//                 {ordersLoading ? (
//                   <div className="text-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//                     <p className="mt-4 text-sm text-gray-400">Loading orders...</p>
//                   </div>
//                 ) : orders.length === 0 ? (
//                   <div className="text-center py-12">
//                     <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-600" />
//                     <h3 className="mt-4 text-lg font-medium text-gray-200">No orders found</h3>
//                     <p className="mt-2 text-sm text-gray-400">Browse products and place your first order.</p>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="space-y-5">
//                       {orders.map(order => (
//                         <div key={order._id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
//                           <div className="flex items-start justify-between mb-3">
//                             <div>
//                               <h3 className="text-lg font-semibold text-gray-100">Order #{order.orderNumber || order._id}</h3>
//                               <p className="text-sm text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
//                             </div>

//                             <div className="text-right">
//                               <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                                 {String(order.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                               </span>
//                               <p className="text-lg font-bold text-gray-100 mt-1">₹{(order.totalAmount || 0).toLocaleString()}</p>
//                             </div>
//                           </div>

//                           <div className="space-y-3">
//                             {(order.items || []).map((item, i) => (
//                               <div key={i} className="flex items-center gap-4">
//                                 <img src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop'} alt={item.product?.name || 'Product'} className="h-16 w-16 object-cover rounded-lg" />
//                                 <div className="flex-1">
//                                   <div className="text-sm font-medium text-gray-100">{item.product?.name || 'Product'}</div>
//                                   <div className="text-xs text-gray-400">Qty: {item.quantity} • Tier: {item.tier || 'standard'}</div>
//                                 </div>
//                                 <div className="text-sm font-medium text-gray-100">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</div>
//                               </div>
//                             ))}
//                           </div>

//                           <div className="mt-3 flex gap-2">
//                             <button className={`${btnSecondary} text-sm`}>View Details</button>
//                             {order.status === 'delivered' && <button className={`${btnPrimary} text-sm`}>Reorder</button>}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Pagination */}
//                     {ordersPagination.pages > 1 && (
//                       <div className="mt-6 flex items-center justify-between">
//                         <div className="text-sm text-gray-400">
//                           Showing {Math.min(((ordersPagination.currentPage - 1) * ordersPagination.limit) + 1, ordersPagination.total || orders.length)} to {Math.min(ordersPagination.currentPage * ordersPagination.limit, ordersPagination.total || orders.length)} of {ordersPagination.total || orders.length} orders
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <button onClick={() => handleOrdersPageChange(ordersPagination.currentPage - 1)} disabled={ordersPagination.currentPage === 1} className="p-2 rounded-md bg-zinc-900 border border-red-900/20 text-gray-300 disabled:opacity-50">
//                             <ChevronLeftIcon className="h-4 w-4" />
//                           </button>

//                           {Array.from({ length: ordersPagination.pages }, (_, i) => i + 1).map(page => (
//                             <button key={page} onClick={() => handleOrdersPageChange(page)} className={`px-3 py-1 rounded-md text-sm ${page === ordersPagination.currentPage ? 'bg-red-700 text-white' : 'bg-zinc-900 border border-red-900/20 text-gray-300'}`}>
//                               {page}
//                             </button>
//                           ))}

//                           <button onClick={() => handleOrdersPageChange(ordersPagination.currentPage + 1)} disabled={ordersPagination.currentPage === ordersPagination.pages} className="p-2 rounded-md bg-zinc-900 border border-red-900/20 text-gray-300 disabled:opacity-50">
//                             <ChevronRightIcon className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             )}

//             {/* LOGO REQUESTS */}
//             {activeTab === 'logo-requests' && (
//               <div>
//                 <h2 className="text-2xl font-bold text-red-300 mb-4">Custom Logo Requests</h2>

//                 {logoRequestsLoading ? (
//                   <div className="text-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//                     <p className="mt-4 text-sm text-gray-400">Loading logo requests...</p>
//                   </div>
//                 ) : logoRequests.length === 0 ? (
//                   <div className="text-center py-12">
//                     <PaintBrushIcon className="mx-auto h-12 w-12 text-gray-600" />
//                     <h3 className="mt-4 text-lg text-gray-100">No logo requests yet</h3>
//                     <p className="mt-2 text-sm text-gray-400">Submit a custom logo request to see it here.</p>
//                     <div className="mt-6">
//                       <a href="/custom-logo-request" className={btnPrimary}>Create Logo Request</a>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-5">
//                     {logoRequests.map(request => (
//                       <div key={request._id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="text-lg font-semibold text-gray-100">{request.businessName}</h3>
//                             <p className="text-sm text-gray-400">Submitted on {new Date(request.createdAt).toLocaleDateString()}</p>
//                           </div>

//                           <div className="text-right">
//                             <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${request.status === 'completed' ? 'text-green-600 bg-green-100' : request.status === 'in-progress' ? 'text-blue-600 bg-blue-100' : request.status === 'under-review' ? 'text-yellow-600 bg-yellow-100' : 'text-gray-600 bg-gray-100'}`}>
//                               {String(request.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                             </span>
//                             <p className="text-lg font-bold text-gray-100 mt-1">₹{(request.estimatedPrice || request.price || 0).toLocaleString()}</p>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                           <div>
//                             <div className="text-sm text-gray-300 font-medium mb-1">Business Details</div>
//                             <p className="text-sm text-gray-400">Industry: {request.industry}</p>
//                             <p className="text-sm text-gray-400">Package: {request.packageType || request.selectedPackage}</p>
//                             {request.website && <p className="text-sm text-gray-400">Website: {request.website}</p>}
//                           </div>

//                           <div>
//                             <div className="text-sm text-gray-300 font-medium mb-1">Design Preferences</div>
//                             <p className="text-sm text-gray-400">Style: {request.designStyle || request.logoStyle}</p>
//                             <p className="text-sm text-gray-400">Colors: {Array.isArray(request.colorPreferences) ? request.colorPreferences.join(', ') : request.colorPreferences}</p>
//                             {request.targetAudience && <p className="text-sm text-gray-400">Target: {request.targetAudience}</p>}
//                           </div>
//                         </div>

//                         {request.description && (
//                           <div className="mt-3">
//                             <div className="text-sm text-gray-300 font-medium mb-1">Description</div>
//                             <p className="text-sm text-gray-400">{request.description}</p>
//                           </div>
//                         )}

//                         {request.referenceImages && request.referenceImages.length > 0 && (
//                           <div className="mt-3">
//                             <div className="text-sm text-gray-300 font-medium mb-2">Reference Images</div>
//                             <div className="flex gap-2">
//                               {request.referenceImages.slice(0, 4).map((img, idx) => (
//                                 <img key={idx} src={`${API_URL}${img}`} alt={`ref-${idx}`} className="h-16 w-16 object-cover rounded-md" />
//                               ))}
//                               {request.referenceImages.length > 4 && (
//                                 <div className="h-16 w-16 rounded-md bg-zinc-900 border border-red-900/20 flex items-center justify-center text-sm text-gray-400">+{request.referenceImages.length - 4}</div>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         <div className="mt-4 flex gap-2">
//                           <button className={`${btnSecondary} text-sm`}>View Details</button>
//                           {request.status === 'completed' && request.finalDesigns && <button className={`${btnPrimary} text-sm`}>Download Designs</button>}
//                           {request.status === 'in-progress' && <button className={`${btnSecondary} text-sm`}>Add Revision</button>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* EMBROIDERY REQUESTS */}
//             {activeTab === 'embroidery-requests' && (
//               <div>
//                 <h2 className="text-2xl font-bold text-red-300 mb-4">Custom Embroidery Requests</h2>

//                 {embroideryRequestsLoading ? (
//                   <div className="text-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//                     <p className="mt-4 text-sm text-gray-400">Loading embroidery requests...</p>
//                   </div>
//                 ) : embroideryRequests.length === 0 ? (
//                   <div className="text-center py-12">
//                     <SwatchIcon className="mx-auto h-12 w-12 text-gray-600" />
//                     <h3 className="mt-4 text-lg text-gray-100">No embroidery requests</h3>
//                     <p className="mt-2 text-sm text-gray-400">Create one from the embroidery page.</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-5">
//                     {embroideryRequests.map(req => (
//                       <div key={req._id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="text-lg font-semibold text-gray-100">{req.businessName}</h3>
//                             <p className="text-sm text-gray-400">Submitted on {new Date(req.createdAt).toLocaleDateString()}</p>
//                           </div>
//                           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : req.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {String(req.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                           <div>
//                             <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Type:</span> {req.embroideryType}</p>
//                             <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Garment:</span> {req.garmentType}</p>
//                             <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Placement:</span> {req.placement}</p>
//                           </div>

//                           <div>
//                             <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Quantity:</span> {req.quantity}</p>
//                             <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Package:</span> {req.packageType}</p>
//                             <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Price:</span> ₹{req.totalPrice}</p>
//                           </div>
//                         </div>

//                         {req.description && (
//                           <div className="mt-3 text-sm text-gray-400">
//                             <div className="font-medium text-gray-300 mb-1">Description</div>
//                             <div>{req.description}</div>
//                           </div>
//                         )}

//                         {req.referenceImages && req.referenceImages.length > 0 && (
//                           <div className="mt-3">
//                             <div className="text-sm text-gray-300 font-medium mb-2">Reference Images</div>
//                             <div className="flex gap-2">
//                               {req.referenceImages.slice(0, 4).map((img, idx) => (
//                                 <img key={idx} src={`${API_URL}${img}`} alt={`ref-${idx}`} className="h-16 w-16 object-cover rounded-md" />
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         <div className="mt-4 flex gap-2">
//                           <button className={`${btnSecondary} text-sm`}>View Details</button>
//                           {req.status === 'completed' && req.finalDesigns && <button className={`${btnPrimary} text-sm`}>Download Designs</button>}
//                           {req.status === 'in-progress' && <button className={`${btnSecondary} text-sm`}>Add Revision</button>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* CUSTOM DESIGN ORDERS */}
//             {activeTab === 'custom-design-orders' && (
//               <div>
//                 <h2 className="text-2xl font-bold text-red-300 mb-4">Custom Design Orders</h2>

//                 {customDesignOrdersLoading ? (
//                   <div className="text-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//                     <p className="mt-4 text-sm text-gray-400">Loading orders...</p>
//                   </div>
//                 ) : customDesignOrders.length === 0 ? (
//                   <div className="text-center py-12">
//                     <PhotoIcon className="mx-auto h-12 w-12 text-gray-600" />
//                     <h3 className="mt-4 text-lg text-gray-100">No custom design orders</h3>
//                     <p className="mt-2 text-sm text-gray-400">Upload and order custom designs to see them here.</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-5">
//                     {customDesignOrders.map(order => (
//                       <div key={order._id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="text-lg font-semibold text-gray-100">{order.product?.name || 'Custom Design Order'}</h3>
//                             <p className="text-sm text-gray-400">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
//                           </div>

//                           <div className="text-right">
//                             <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'completed' ? 'text-green-600 bg-green-100' : order.status === 'in-progress' ? 'text-blue-600 bg-blue-100' : order.status === 'pending' ? 'text-yellow-600 bg-yellow-100' : 'text-gray-600 bg-gray-100'}`}>
//                               {String(order.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                             </span>
//                             <p className="text-lg font-bold text-gray-100 mt-1">₹{order.totalCost?.toLocaleString()}</p>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                           <div>
//                             <div className="text-sm text-gray-300 font-medium mb-1">Order Details</div>
//                             <p className="text-sm text-gray-400">Design Type: {order.designType}</p>
//                             <p className="text-sm text-gray-400">Quantity: {order.quantity}</p>
//                             {order.deliveryType && <p className="text-sm text-gray-400">Delivery: {order.deliveryType}</p>}
//                           </div>

//                           <div>
//                             <div className="text-sm text-gray-300 font-medium mb-1">Design Placements</div>
//                             {order.designPlacements && order.designPlacements.length > 0 ? (
//                               order.designPlacements.map((placement, idx) => (
//                                 <p key={idx} className="text-sm text-gray-400">{placement.position}: {placement.width}x{placement.height}</p>
//                               ))
//                             ) : (
//                               <p className="text-sm text-gray-400">No placements specified</p>
//                             )}
//                           </div>
//                         </div>

//                         {order.specialInstructions && (
//                           <div className="mt-3 text-sm text-gray-400">
//                             <div className="font-medium text-gray-300 mb-1">Special Instructions</div>
//                             <div>{order.specialInstructions}</div>
//                           </div>
//                         )}

//                         {order.uploadedDesign && (
//                           <div className="mt-3">
//                             <div className="text-sm text-gray-300 font-medium mb-2">Uploaded Design</div>
//                             <div className="flex items-center gap-3">
//                               <img src={`${API_URL}${order.uploadedDesign.url}`} alt="Uploaded design" className="h-20 w-20 object-cover rounded-md" />
//                               <div>
//                                 <div className="text-sm font-medium text-gray-100">{order.uploadedDesign.originalName}</div>
//                                 <div className="text-xs text-gray-400">{order.uploadedDesign.fileType} • {(order.uploadedDesign.size / 1024 / 1024).toFixed(2)} MB</div>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         <div className="mt-4 flex gap-2">
//                           <button className={`${btnSecondary} text-sm`}>View Details</button>
//                           {order.status === 'completed' && order.finalDesigns && <button className={`${btnPrimary} text-sm`}>Download Final Design</button>}
//                           {order.status === 'pending' && <button className={`${btnSecondary} text-sm`}>Cancel Order</button>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* FAVORITES */}
//             {activeTab === 'favorites' && (
//               <div>
//                 <h2 className="text-2xl font-bold text-red-300 mb-4">Favorite Items</h2>

//                 {favorites.length === 0 ? (
//                   <div className="text-center py-12">
//                     <HeartIcon className="mx-auto h-12 w-12 text-gray-600" />
//                     <h3 className="mt-4 text-lg text-gray-100">No favorites yet</h3>
//                     <p className="mt-2 text-sm text-gray-400">Save items you love to see them here.</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                     {favorites.map(item => (
//                       <div key={item.id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
//                         <div className="aspect-square w-full overflow-hidden rounded-md mb-3 bg-zinc-800">
//                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-100">{item.name}</h3>
//                           <p className="text-sm text-gray-400 capitalize">{item.category}</p>
//                           <div className="mt-3 flex items-center justify-between">
//                             <div className="text-xl font-bold text-gray-100">₹{item.price}</div>
//                             <button className={`${btnPrimary} text-sm`}>Add to Cart</button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* SETTINGS */}
//             {activeTab === 'settings' && (
//               <div className="max-w-2xl mx-auto">
//                 <h2 className="text-2xl font-bold text-red-300 mb-6">Account Settings</h2>

//                 {/* Change Password */}
//                 <div className="mb-8 bg-zinc-900 border border-red-900/20 rounded-lg p-4">
//                   <h3 className="text-lg font-medium text-gray-100 mb-4">Change Password</h3>
//                   <form onSubmit={handlePasswordChange} className="space-y-4">
//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Current Password</label>
//                       <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className={inputBase} required />
//                     </div>

//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">New Password</label>
//                       <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className={inputBase} required />
//                     </div>

//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Confirm New Password</label>
//                       <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className={inputBase} required />
//                     </div>

//                     <div className="flex gap-3">
//                       <button type="submit" disabled={loading} className={btnPrimary}>
//                         {loading ? 'Changing...' : 'Change Password'}
//                       </button>
//                     </div>
//                   </form>
//                 </div>

//                 {/* Account Actions */}
//                 <div className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
//                   <h3 className="text-lg font-medium text-gray-100 mb-4">Account Actions</h3>
//                   <div className="space-y-3">
//                     <button onClick={logout} className={`${btnSecondary} w-full text-left`}>Sign Out</button>
//                     <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg border border-red-900/20">Delete Account</button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile
