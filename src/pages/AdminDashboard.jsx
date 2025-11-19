import { useState, useEffect } from 'react'
import {
  UsersIcon,
  ShoppingBagIcon,
  PhotoIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  UserGroupIcon,
  SparklesIcon,
  SwatchIcon,
  Bars3Icon,
  HomeIcon,
  CogIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

import {
  Chart as ChartJS,
  Filler
} from "chart.js";

// Register Filler plugin (required for area chart)
ChartJS.register(Filler);

import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import imageCompression from 'browser-image-compression'
import AdminContactMessages from '../components/AdminContactMessages'
import DashboardCharts from '../components/analytics/DashboardCharts'
import { API_URL } from '../config/api'


const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);


  // Real data from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalLogoRequests: 0,
    totalEmbroideryRequests: 0,
    totalCustomDesignOrders: 0,
    totalReviews: 0
  })

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)

  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)

  // Product management states
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [productFilterCategory, setProductFilterCategory] = useState('')
  const [productFilterStatus, setProductFilterStatus] = useState('active') // '' = all, 'active' = active only, 'inactive' = inactive only
  const [productSortBy, setProductSortBy] = useState('name')
  const [productSortOrder, setProductSortOrder] = useState('asc')
  const [productPriceRange, setProductPriceRange] = useState({ min: '', max: '' })

  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderSearchTerm, setOrderSearchTerm] = useState('')

  // Orders pagination and filtering
  const [ordersPagination, setOrdersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  })
  const [ordersFilters, setOrdersFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const [logoRequests, setLogoRequests] = useState([])
  const [logoRequestsLoading, setLogoRequestsLoading] = useState(false)

  const [embroideryRequests, setEmbroideryRequests] = useState([])
  const [embroideryRequestsLoading, setEmbroideryRequestsLoading] = useState(false)

  const [customDesignOrders, setCustomDesignOrders] = useState([])
  const [customDesignOrdersLoading, setCustomDesignOrdersLoading] = useState(false)

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewStats, setReviewStats] = useState({})

  /// Chart data states
  // ======================= CHART STATES ==========================
  const [chartData, setChartData] = useState({
    ordersData: [],
    revenueData: [],
    usersData: []
  });

  const [chartsLoading, setChartsLoading] = useState(false);

  // ======================= FETCH ANALYTICS ==========================
  const fetchAnalytics = async () => {
    try {
      setChartsLoading(true);

      const res = await axios.get(`${API_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("🔥 RAW DATA:", res.data);

      // ------------------ 1. DAILY ORDERS ------------------
      const ordersData = res.data.charts.ordersDaily.map(item => ({
        date: item._id,      // "2025-01-01"
        count: item.count    // number of orders
      }));

      // ------------------ 2. MONTHLY REVENUE ------------------
      const revenueData = res.data.charts.revenueMonthly.map(item => ({
        month: item._id,         // "2025-01"
        total: item.totalAmount  // ✔ backend field!
      }));

      // ------------------ 3. NEW USERS DAILY ------------------
      const usersData = res.data.charts.usersDaily.map(item => ({
        day: item._id,       // "2025-01-01"
        count: item.count
      }));

      console.log("📌 TRANSFORMED DATA:", {
        ordersData,
        revenueData,
        usersData
      });

      // ------------------ SET STATE ------------------
      setChartData({
        ordersData,
        revenueData,
        usersData
      });

    } catch (err) {
      console.error("Analytics Fetch Error:", err);
    } finally {
      setChartsLoading(false);
    }
  };




  // ======================= RUN ON MOUNT ==========================
  useEffect(() => {
    if (token) {
      fetchAnalytics();
    } else {
      console.log("⛔ Token missing – analytics not fetched");
    }
  }, [token]);




  // Categories and subcategories data
  const categories = {
    'apparels': {
      label: 'Apparels',
      subcategories: [
        { value: 'cap', label: 'Cap' },
        { value: 'jackets', label: 'Jackets' },
        { value: 'Shirt', label: 'Shirt' },
        { value: 'denim-shirt', label: 'T-Shirt' },
        { value: 'windcheaters', label: 'Windcheaters' }
      ]
    },
    'travels': {
      label: 'Travels',
      subcategories: [
        { value: 'hand-bag', label: 'Hand Bag' },
        { value: 'strolley-bags', label: 'Strolley Bags' },
        { value: 'travel-bags', label: 'Travel Bags' },
        { value: 'back-packs', label: 'Back Packs' },
        { value: 'laptop-bags', label: 'Laptop Bags' }
      ]
    },
    'leather': {
      label: 'Leather',
      subcategories: [
        { value: 'office-bags', label: 'Office Bags' },
        { value: 'wallets', label: 'Wallets' }
      ]
    },
    'uniforms': {
      label: 'Uniforms',
      subcategories: [
        { value: 'school-uniforms', label: 'School Uniforms' },
        { value: 'corporate', label: 'Corporate' }
      ]
    },
    'design-services': {
      label: 'Design Services',
      subcategories: [
        { value: 'logo-design', label: 'Logo Design' },
        { value: 'business-card', label: 'Business Card' },
        { value: 'brochure', label: 'Brochure' },
        { value: 'banner', label: 'Banner' },
        { value: 'poster', label: 'Poster' },
        { value: 'flyer', label: 'Flyer' },
        { value: 'website-design', label: 'Website Design' }
      ]
    },
    'embroidery': {
      label: 'Embroidery',
      subcategories: [
        { value: 'logo-embroidery', label: 'Logo Embroidery' },
        { value: 'text-embroidery', label: 'Text Embroidery' },
        { value: 'custom-patches', label: 'Patches' },
        { value: 'monogramming', label: 'Monogramming' },
        { value: 'badge-embroidery', label: 'Badge Embroidery' },
        { value: 'custom-embroidery', label: 'Custom Embroidery' },
        { value: 'hand-embroidery', label: 'Hand Embroidery' }
      ]
    },
    'other': {
      label: 'Other',
      subcategories: [
        { value: 'other', label: 'Other' }
      ]
    }
  }

  // Profile management state
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Modal states for CRUD operations
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [imagePreview, setImagePreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)


  const handleImageUpload = async (e) => {
    let file = e.target.files[0]; // ✅ change 'const' to 'let' for compression
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // =========================
    // ✅ NEW: Compress the image before upload
    // =========================
    try {
      const options = {
        maxSizeMB: 5,             // Max size after compression
        maxWidthOrHeight: 1920,   // Max dimensions
        useWebWorker: true
      };
      file = await imageCompression(file, options); // Compress file
    } catch (err) {
      console.error('Image compression error:', err);
      toast.error('Failed to compress image');
      return;
    }

    // Validate compressed file size (just in case)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Compressed image is still larger than 5MB');
      return;
    }

    // Set selected file and create preview immediately
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setIsUploading(true);

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('images', file);

    try {
      const response = await axios.post('/api/uploads/product', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload response:', response.data); // Debug log

      // Backend returns an array of files, get the first one
      if (response.data.success && response.data.files && response.data.files[0]) {
        const imageUrl = response.data.files[0].url;
        console.log('Setting imageUrl:', imageUrl); // Debug log

        setProductFormData(prev => ({
          ...prev,
          imageUrl: imageUrl
        }));

        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.response?.data?.message || 'Image upload failed');
      // Clear preview on error
      setImagePreview('');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };


  const clearImage = () => {
    setImagePreview('');
    setSelectedFile(null);
    setProductFormData({ ...productFormData, imageUrl: '' });
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };



  // Form data states
  const [userFormData, setUserFormData] = useState({ name: '', email: '', role: 'user' })
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: {
      base: 0,
      premium: 0,
      enterprise: 0
    },
    images: [],
    imageUrl: '',
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    }
  })

  // Define tabs
  const tabs = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'products', name: 'Products', icon: PhotoIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'reviews', name: 'Reviews', icon: ChatBubbleLeftRightIcon },
    { id: 'logo-requests', name: 'Logo Requests', icon: SparklesIcon },
    { id: 'embroidery-requests', name: 'Embroidery Requests', icon: SwatchIcon },
    { id: 'custom-design-orders', name: 'Custom Design Orders', icon: CogIcon },
    { id: 'view-contact-messages', name: 'Contact Messages', icon: UserGroupIcon }
  ]

  // Enhanced product filtering
  const filteredProducts = products.filter(product => {
    // Status filter
    if (productFilterStatus === 'active' && product.isActive !== true) return false
    if (productFilterStatus === 'inactive' && product.isActive !== false) return false

    // Search by name filter
    if (productSearchTerm && !product.name.toLowerCase().includes(productSearchTerm.toLowerCase())) {
      return false
    }

    // Category filter
    if (productFilterCategory && product.category !== productFilterCategory) {
      return false
    }

    // Price range filter
    const basePrice = product.price?.base || 0
    if (productPriceRange.min && basePrice < Number(productPriceRange.min)) {
      return false
    }
    if (productPriceRange.max && basePrice > Number(productPriceRange.max)) {
      return false
    }

    return true
  }).sort((a, b) => {
    // Sorting logic
    let aValue, bValue

    switch (productSortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'price':
        aValue = a.price?.base || 0
        bValue = b.price?.base || 0
        break
      case 'category':
        aValue = a.category
        bValue = b.category
        break
      case 'status':
        aValue = a.isActive ? 1 : 0
        bValue = b.isActive ? 1 : 0
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
    }

    if (productSortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Get all available categories from the categories object
  const productCategories = Object.keys(categories)

  // Filtered orders based on search term
  const filteredOrders = orders.filter(order => {
    if (!orderSearchTerm) return true
    const searchLower = orderSearchTerm.toLowerCase()
    return (
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchLower)) ||
      (order.shippingAddress?.fullName && order.shippingAddress.fullName.toLowerCase().includes(searchLower))
    )
  })

  const getCustomerName = (order) => {
    const addr = order?.shippingAddress || {};

    // 1) If fullName exists → highest priority
    if (addr.fullName) return addr.fullName;

    // 2) If firstName or lastName exists
    if (addr.firstName || addr.lastName) {
      return `${addr.firstName || ""} ${addr.lastName || ""}`.trim();
    }

    // 3) If "name" exists
    if (addr.name) return addr.name;

    // 4) If order.user.name exists
    if (order.user?.name) return order.user.name;

    // 5) Default
    return "N/A";
  };



  // Product statistics
  const productStats = {
    total: products.length,
    active: products.filter(p => p.isActive === true).length,
    inactive: products.filter(p => p.isActive === false).length,
    filtered: filteredProducts.length,
    byCategory: productCategories.reduce((acc, category) => {
      acc[category] = products.filter(p => p.category === category).length
      return acc
    }, {}),
    averagePrice: products.length > 0 ?
      (products.reduce((sum, p) => sum + (p.price?.base || 0), 0) / products.length).toFixed(2) : 0
  }

  // API Functions
  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const [usersRes, ordersRes, productStatsRes, logoRequestsRes, embroideryRequestsRes, customDesignOrdersRes, reviewsRes] = await Promise.all([
        axios.get('/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/products/admin/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/custom-logo-requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/custom-embroidery-requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/custom-design-orders/admin', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/admin/reviews', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      // Calculate total revenue from all order types
      const ordersRevenue = ordersRes.data.orders?.reduce((sum, order) => sum + (order.pricing?.total || 0), 0) || 0
      const logoRequestsRevenue = logoRequestsRes.data.data?.reduce((sum, request) => sum + (request.pricing?.totalPrice || 0), 0) || 0
      const embroideryRequestsRevenue = embroideryRequestsRes.data.data?.reduce((sum, request) => sum + (request.pricing?.totalPrice || 0), 0) || 0
      const customDesignOrdersRevenue = customDesignOrdersRes.data.orders?.reduce((sum, order) => sum + (order.pricing?.totalPrice || 0), 0) || 0
      const totalRevenue = ordersRevenue + logoRequestsRevenue + embroideryRequestsRevenue + customDesignOrdersRevenue

      setStats({
        totalUsers: usersRes.data.total || 0,
        totalOrders: ordersRes.data.total || 0,
        totalProducts: productStatsRes.data.stats?.activeProducts || 0,
        totalRevenue,
        totalLogoRequests: logoRequestsRes.data.total || 0,
        totalEmbroideryRequests: embroideryRequestsRes.data.total || 0,
        totalCustomDesignOrders: customDesignOrdersRes.data.total || 0,
        totalReviews: reviewsRes.data.data?.pagination?.total || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to fetch dashboard statistics')
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchChartData = async () => {
    setChartsLoading(true)
    try {
      // Generate sample data for the last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

      // For now, we'll use sample data. In a real app, you'd fetch this from APIs
      const ordersData = months.map((month, index) => ({
        name: month,
        orders: Math.floor(Math.random() * 50) + 30 + index * 5
      }))

      const revenueData = months.map((month, index) => ({
        name: month,
        revenue: Math.floor(Math.random() * 3000) + 2000 + index * 500
      }))

      const usersData = months.map((month, index) => ({
        name: month,
        users: Math.floor(Math.random() * 30) + 10 + index * 8
      }))

      setChartData({
        ordersData,
        revenueData,
        usersData
      })
    } catch (error) {
      console.error('Error fetching chart data:', error)
      toast.error('Failed to fetch chart data')
    } finally {
      setChartsLoading(false)
    }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setUsersLoading(false)
    }
  }



  const fetchProducts = async () => {
    setProductsLoading(true)
    try {
      const response = await axios.get('/api/products/admin/all?limit=1000', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchOrders = async (page = 1) => {
    setOrdersLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ordersPagination.limit.toString(),
        ...(ordersFilters.search && { search: ordersFilters.search }),
        ...(ordersFilters.status && { status: ordersFilters.status }),
        sortBy: ordersFilters.sortBy,
        sortOrder: ordersFilters.sortOrder
      })

      const response = await axios.get(`/api/orders?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      setOrders(response.data.orders || [])
      setOrdersPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
        limit: response.data.limit || 10
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  const detectPaymentMethod = () => {
    const m = selectedOrder.paymentMethod;

    if (m) return m.replace(/_/g, " ");

    // fallback if method missing
    if (selectedOrder.paymentDetails?.cardLast4) return "card";
    if (selectedOrder.paymentDetails?.upiId) return "upi";

    return "cod"; // final fallback
  };


  const fetchLogoRequests = async () => {
    setLogoRequestsLoading(true)
    try {
      const response = await axios.get('/api/custom-logo-requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setLogoRequests(response.data.data || [])
    } catch (error) {
      console.error('Error fetching logo requests:', error)
      toast.error('Failed to fetch logo requests')
    } finally {
      setLogoRequestsLoading(false)
    }
  }

  const fetchEmbroideryRequests = async () => {
    setEmbroideryRequestsLoading(true)
    try {
      const response = await axios.get('/api/custom-embroidery-requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setEmbroideryRequests(response.data.data || [])
    } catch (error) {
      console.error('Error fetching embroidery requests:', error)
      toast.error('Failed to fetch embroidery requests')
    } finally {
      setEmbroideryRequestsLoading(false)
    }
  }

  const fetchCustomDesignOrders = async () => {
    setCustomDesignOrdersLoading(true)
    try {
      const response = await axios.get('/api/custom-design-orders/admin', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setCustomDesignOrders(response.data.orders || [])
    } catch (error) {
      console.error('Error fetching custom design orders:', error)
      toast.error('Failed to fetch custom design orders')
    } finally {
      setCustomDesignOrdersLoading(false)
    }
  }

  const fetchReviews = async () => {
    setReviewsLoading(true)
    try {
      const response = await axios.get('/api/admin/reviews', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setReviews(response.data.data.reviews || [])
      setReviewStats(response.data.data.statusCounts || {})
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to fetch reviews')
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleLogoRequestStatusChange = async (requestId, newStatus) => {
    try {
      await axios.put(`/api/custom-logo-requests/${requestId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      toast.success('Logo request status updated successfully')
      fetchLogoRequests()
    } catch (error) {
      console.error('Error updating logo request status:', error)
      toast.error('Failed to update logo request status')
    }
  }

  const handleEmbroideryRequestStatusChange = async (requestId, newStatus) => {
    try {
      await axios.put(`/api/custom-embroidery-requests/${requestId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      toast.success('Embroidery request status updated successfully')
      fetchEmbroideryRequests()
    } catch (error) {
      console.error('Error updating embroidery request status:', error)
      toast.error('Failed to update embroidery request status')
    }
  }

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      // Find the current order to get its current status
      const currentOrder = orders.find(order => order._id === orderId)
      if (!currentOrder) {
        toast.error('Order not found')
        return
      }

      const currentStatus = currentOrder.status

      // Validate status transitions
      const invalidTransitions = {
        'completed': ['pending', 'confirmed', 'in-progress'],
        'cancelled': ['pending', 'confirmed', 'in-progress', 'completed']
      }

      if (invalidTransitions[currentStatus] && invalidTransitions[currentStatus].includes(newStatus)) {
        toast.error(`Cannot change status from ${currentStatus} to ${newStatus}`)
        return
      }

      // Confirm critical status changes
      if ((newStatus === 'cancelled' || newStatus === 'completed') && currentStatus !== newStatus) {
        const confirmMessage = newStatus === 'cancelled'
          ? 'Are you sure you want to cancel this order?'
          : 'Are you sure you want to mark this order as completed?'

        if (!window.confirm(confirmMessage)) {
          return
        }
      }

      await axios.put(`/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      toast.success('Order status updated successfully')
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update order status'
      toast.error(errorMessage)
    }
  }

  const handleReviewStatusChange = async (reviewId, newStatus) => {
    try {
      await axios.put(`/api/admin/reviews/${reviewId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      toast.success('Review status updated successfully')
      fetchReviews()
    } catch (error) {
      console.error('Error updating review status:', error)
      toast.error('Failed to update review status')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        // Get admin token
        const token = localStorage.getItem('token');

        // Call the delete API route
        const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          toast.success('Review deleted successfully');
          fetchReviews(); // refresh the list
        } else {
          toast.error(response.data.message || 'Failed to delete review');
        }

      } catch (error) {
        console.error('Error deleting review:', error);
        // Check if backend sent a message
        const msg = error.response?.data?.message || 'Failed to delete review';
        toast.error(msg);
      }
    }
  };



  // CRUD Handlers for Users
  const handleAddUser = async () => {
    try {
      const { name, email, role, password } = userFormData;

      // ✅ Frontend validation
      if (!name || !email || !role || !password) {
        toast.error('All fields are required'); // Highlighted: password included
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Invalid email format');
        return;
      }

      // ✅ Password length validation
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      const response = await axios.post('/api/users', userFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('User added successfully');
      setShowAddUserModal(false);
      setUserFormData({ name: '', email: '', role: 'user', password: '' }); // Reset form
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };


  const handleEditUser = async () => {
    // Check if email is changed
    if (userFormData.email !== selectedUser.email) {
      toast.error("Email cannot be edited");
      setUserFormData(prev => ({ ...prev, email: selectedUser.email })); // reset email
      return;
    }

    try {
      const response = await axios.put(
        `/api/users/${selectedUser._id}`,
        userFormData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success('User updated successfully');
      setShowEditUserModal(false);
      setSelectedUser(null);
      setUserFormData({ name: '', email: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };


  const handleDeleteUser = async (userId) => {
    console.log('Deleting user ID:', userId);

    if (!userId) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not authorized');
      return;
    }

    try {
      const response = await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success(response.data.message || 'User deleted successfully');

        // Optimistic UI update
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));

        // Optional: fetch latest users to ensure sync
        await fetchUsers();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error.response || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };




  // CRUD Handlers for Products
  const handleAddProduct = async () => {
    try {
      // Validate required fields
      if (!productFormData.name || !productFormData.description || !productFormData.category || !productFormData.subcategory) {
        toast.error('Please fill in all required fields')
        return
      }

      if (!productFormData.price.base || productFormData.price.base <= 0) {
        toast.error('Base price must be greater than 0')
        return
      }

      // Transform the data to match backend expectations
      const transformedData = {
        ...productFormData,
        // Convert imageUrl to images array if imageUrl exists
        images: productFormData.imageUrl ? [
          {
            url: productFormData.imageUrl,
            alt: productFormData.name || '',
            isPrimary: true
          }
        ] : productFormData.images || [],
        // Ensure subcategory is not empty string
        subcategory: productFormData.subcategory || 'other',
        // Ensure deliveryTime is properly set
        deliveryTime: {
          base: Number(productFormData.deliveryTime?.base) || 7,
          premium: Number(productFormData.deliveryTime?.premium) || 5,
          enterprise: Number(productFormData.deliveryTime?.enterprise) || 3
        },
        // Ensure price values are numbers
        price: {
          base: Number(productFormData.price.base),
          premium: Number(productFormData.price.premium) || 0,
          enterprise: Number(productFormData.price.enterprise) || 0
        }
      }

      // Remove imageUrl from the data being sent
      delete transformedData.imageUrl

      console.log('Sending product data:', JSON.stringify(transformedData, null, 2))
      console.log('Auth token exists:', !!localStorage.getItem('token'))

      const response = await axios.post('/api/products', transformedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Product added successfully')
      setShowAddProductModal(false)

      // Reset form data and clear image preview states
      setProductFormData({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        price: { base: 0, premium: 0, enterprise: 0 },
        images: [],
        imageUrl: '',
        deliveryTime: { base: 7, premium: 5, enterprise: 3 }
      })

      // Clear image preview states (add these lines)
      setImagePreview('')
      setSelectedFile(null)

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''

      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to add product')
    }
  }

  const handleEditProduct = async () => {
    try {
      // Validate required fields
      if (!productFormData.name || !productFormData.description || !productFormData.category || !productFormData.subcategory) {
        toast.error('Please fill in all required fields')
        return
      }

      if (!productFormData.price.base || productFormData.price.base <= 0) {
        toast.error('Base price must be greater than 0')
        return
      }

      // Transform the data to match backend expectations
      const transformedData = {
        ...productFormData,
        // Convert imageUrl to images array if imageUrl exists
        images: productFormData.imageUrl ? [
          {
            url: productFormData.imageUrl,
            alt: productFormData.name || '',
            isPrimary: true
          }
        ] : productFormData.images || [],
        // Ensure subcategory is not empty string
        subcategory: productFormData.subcategory && productFormData.subcategory.trim() !== '' ? productFormData.subcategory.trim() : 'other',
        // Ensure deliveryTime is properly set
        deliveryTime: {
          base: Number(productFormData.deliveryTime?.base) || 7,
          premium: Number(productFormData.deliveryTime?.premium) || 5,
          enterprise: Number(productFormData.deliveryTime?.enterprise) || 3
        },
        // Ensure price values are numbers
        price: {
          base: Number(productFormData.price.base),
          premium: Number(productFormData.price.premium) || 0,
          enterprise: Number(productFormData.price.enterprise) || 0
        }
      }

      // Remove imageUrl from the data being sent
      delete transformedData.imageUrl

      console.log('Updating product data:', JSON.stringify(transformedData, null, 2))

      const response = await axios.put(`/api/products/${selectedProduct._id}`, transformedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Product updated successfully')
      setShowEditProductModal(false)
      setSelectedProduct(null)

      // Reset form data and clear image preview states
      setProductFormData({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        price: { base: 0, premium: 0, enterprise: 0 },
        images: [],
        imageUrl: '',
        deliveryTime: { base: 7, premium: 5, enterprise: 3 }
      })

      // Clear image preview states
      setImagePreview('')
      setSelectedFile(null)

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''

      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error(error.response?.data?.message || 'Failed to delete product')
      }
    }
  }

  const handleToggleProductStatus = async (productId, currentStatus) => {
    try {
      await axios.patch(`/api/products/${productId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully`)
      fetchProducts()
      fetchStats() // Refresh stats to update active product count
    } catch (error) {
      console.error('Error toggling product status:', error)
      toast.error(error.response?.data?.message || 'Failed to update product status')
    }
  }

  const handleActivateAllProducts = async () => {
    if (window.confirm('Are you sure you want to activate all products?')) {
      try {
        const response = await axios.patch('/api/products/admin/activate-all', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        toast.success(response.data.message)
        fetchProducts()
        fetchStats() // Refresh stats to update active product count
      } catch (error) {
        console.error('Error activating all products:', error)
        toast.error(error.response?.data?.message || 'Failed to activate all products')
      }
    }
  }

  // Profile and logout handlers
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleProfileUpdate = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Profile updated successfully')
      setShowProfileModal(false)
      // Optionally refresh user data
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    }
  }

  // Load initial data
  useEffect(() => {
    fetchStats()
    fetchChartData()
  }, [])

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'users':
        fetchUsers()
        break
      case 'products':
        fetchProducts()
        break
      case 'orders':
        fetchOrders()
        break
      case 'logo-requests':
        fetchLogoRequests()
        break
      case 'embroidery-requests':
        fetchEmbroideryRequests()
        break
      case 'custom-design-orders':
        fetchCustomDesignOrders()
        break
      case 'reviews':
        fetchReviews()
        break
      default:
        break
    }
  }, [activeTab])

  // Refetch orders when filters change
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders(1) // Reset to page 1 when filters change
    }
  }, [ordersFilters])

  const handleOrdersFilterChange = (key, value) => {
    setOrdersFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleOrdersPageChange = (page) => {
    fetchOrders(page)
  }

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 'text-green-600 bg-green-100';
    if (s === 'processing') return 'text-blue-600 bg-blue-100';
    if (s === 'shipped') return 'text-purple-600 bg-purple-100';
    if (s === 'cancelled') return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };
  // Export functions
  const handleExportOrders = async () => {
    try {
      const response = await axios.get('/api/orders/export/csv', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Orders exported successfully')
    } catch (error) {
      console.error('Error exporting orders:', error)
      toast.error('Failed to export orders')
    }
  }

  const handleExportUsers = async () => {
    try {
      const response = await axios.get('/api/users/export/csv', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Users exported successfully')
    } catch (error) {
      console.error('Error exporting users:', error)
      toast.error('Failed to export users')
    }
  }

  const handleExportLogoRequests = async () => {
    try {
      const response = await axios.get('/api/custom-logo-requests/export/csv', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `logo_requests_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Logo requests exported successfully')
    } catch (error) {
      console.error('Error exporting logo requests:', error)
      toast.error('Failed to export logo requests')
    }
  }

  const handleExportEmbroideryRequests = async () => {
    try {
      const response = await axios.get('/api/custom-embroidery-requests/export/csv', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `embroidery_requests_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Embroidery requests exported successfully')
    } catch (error) {
      console.error('Error exporting embroidery requests:', error)
      toast.error('Failed to export embroidery requests')
    }
  }

  const handleExportCustomDesignOrders = async () => {
    try {
      const response = await axios.get('/api/custom-design-orders/export/csv', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `custom_design_orders_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Custom design orders exported successfully')
    } catch (error) {
      console.error('Error exporting custom design orders:', error)
      toast.error('Failed to export custom design orders')
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 transition-all duration-300 z-20 
  ${sidebarCollapsed ? "w-20" : "w-64"} flex flex-col`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500 mt-1">Management Dashboard</p>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Bars3Icon className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition 
            ${active
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
                title={sidebarCollapsed ? tab.name : ""}
              >
                <Icon className="w-5 h-5" />

                {!sidebarCollapsed && (
                  <span className="ml-3 truncate">{tab.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200">
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center" : "space-x-3"
              }`}
          >
            {/* Profile Circle */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold hover:bg-orange-700 transition"
              title={sidebarCollapsed ? "Profile Settings" : ""}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </button>

            {/* Name + Role */}
            {!sidebarCollapsed && (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex-1 text-left p-1 rounded hover:bg-gray-50 transition"
              >
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </button>
            )}

            {/* Logout */}
            {!sidebarCollapsed && (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}>
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            {/* Left: Dynamic Page Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name || "Dashboard"}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Manage your e-commerce platform
              </p>
            </div>

            {/* Right: User Chip */}
            <div className="flex items-center space-x-3">

              {/* Avatar Circle */}
              <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* Name Badge */}
              <div className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200">
                {user?.name || "Admin"}
              </div>
            </div>
          </div>
        </div>



        {/* Content Area */}
        <div className="flex-1">
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                  {/* USERS */}
                  <div
                    onClick={() => setActiveTab('users')}
                    className="bg-white border border-gray-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {statsLoading ? '...' : stats.totalUsers}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          +12% last month
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <UsersIcon className="h-7 w-7 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* ORDERS */}
                  <div
                    onClick={() => setActiveTab('orders')}
                    className="bg-white border border-gray-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {statsLoading ? '...' : stats.totalOrders}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                          +8% last month
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                        <ShoppingBagIcon className="h-7 w-7 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <div
                    onClick={() => setActiveTab('products')}
                    className="bg-white border border-gray-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {statsLoading ? '...' : stats.totalProducts}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          +5% last month
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                        <PhotoIcon className="h-7 w-7 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* REVENUE */}
                  <div
                    onClick={() => setActiveTab('orders')}
                    className="bg-white border border-gray-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {statsLoading ? '...' : `₹${stats.totalRevenue.toFixed(2)}`}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                          +15% last month
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                        <ChartBarIcon className="h-7 w-7 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* LOGO REQUESTS */}
                  <div
                    onClick={() => setActiveTab('logo-requests')}
                    className="bg-white border border-gray-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Logo Requests</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {statsLoading ? '...' : stats.totalLogoRequests}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-full">
                          +3% last month
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                        <SparklesIcon className="h-7 w-7 text-rose-600" />
                      </div>
                    </div>
                  </div>

                  {/* EMBROIDERY REQUESTS */}
                  <div
                    onClick={() => setActiveTab('embroidery-requests')}
                    className="bg-white border border-gray-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Embroidery Requests</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {statsLoading ? '...' : stats.totalEmbroideryRequests}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full">
                          +7% last month
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                        <SwatchIcon className="h-7 w-7 text-cyan-600" />
                      </div>
                    </div>
                  </div>

                  {/* CUSTOM DESIGN ORDERS */}
                  <div
                    onClick={() => setActiveTab('custom-design-orders')}
                    className="bg-white border border-gray-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Custom Design Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {statsLoading ? '...' : stats.totalCustomDesignOrders}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          +12% last month
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <CogIcon className="h-7 w-7 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* REVIEWS */}
                  <div
                    onClick={() => setActiveTab('reviews')}
                    className="bg-white border border-gray-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Total Reviews</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {statsLoading ? '...' : stats.totalReviews}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                          +10% last month
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                        <ChatBubbleLeftRightIcon className="h-7 w-7 text-indigo-600" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Analytics Charts Section */}
                <div className="mt-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Analytics Overview</h2>
                    <p className="text-gray-600 text-sm">
                      Track your business performance with detailed charts and trends
                    </p>
                  </div>

                  <DashboardCharts
                    ordersData={chartData.ordersData}
                    revenueData={chartData.revenueData}
                    usersData={chartData.usersData}
                    loading={chartsLoading}
                  />
                </div>

              </div>
            )}


            {/* User Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 flex-wrap">
                  <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
                  <div className="flex space-x-3 mt-2 sm:mt-0">

                    <button
                      onClick={handleExportUsers}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5 inline mr-2 text-gray-600" />
                      Export CSV
                    </button>

                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      <PlusIcon className="h-5 w-5 inline mr-2" />
                      Add User
                    </button>

                  </div>
                </div>

                {/* Loading */}
                {usersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4 text-sm">Loading users...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">

                    {/* Desktop Table */}
                    <div className="hidden sm:block">
                      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">

                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            {["User", "Email", "Role", "Joined", "Actions"].map((head) => (
                              <th
                                key={head}
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                              >
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody className="bg-white">
                          {users.map((user) => (
                            <tr
                              key={user._id}
                              className="hover:bg-gray-50 transition cursor-pointer border-b border-gray-100"
                            >

                              {/* USER */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                  </div>
                                  <span className="text-gray-900 font-medium text-sm">
                                    {user.name}
                                  </span>
                                </div>
                              </td>

                              {/* EMAIL */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {user.email}
                              </td>

                              {/* ROLE */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full border ${user.role === "admin"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                    }`}
                                >
                                  {user.role}
                                </span>
                              </td>

                              {/* JOINED */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>

                              {/* ACTIONS */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setUserFormData({
                                      name: user.name,
                                      email: user.email,
                                      role: user.role,
                                    });
                                    setShowEditUserModal(true);
                                  }}
                                  className="text-gray-600 hover:text-blue-600 transition"
                                  title="Edit User"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-gray-600 hover:text-red-600 transition"
                                  title="Delete User"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </td>

                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-4 mt-4">
                      {users.map((user) => (
                        <div
                          key={user._id}
                          className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">{user.name}</p>
                              <p className="text-gray-600 text-xs">{user.email}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full border ${user.role === "admin"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-green-50 text-green-700 border-green-200"
                                }`}
                            >
                              {user.role}
                            </span>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUserFormData({
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                                  });
                                  setShowEditUserModal(true);
                                }}
                                className="text-gray-600 hover:text-blue-600 transition p-1"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-gray-600 hover:text-red-600 transition p-1"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            )}





            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900">Product Management</h3>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    <PlusIcon className="h-5 w-5 inline mr-2" />
                    Add Product
                  </button>
                </div>

                {/* Product Stats (Stripe Style) */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                  {[
                    { label: 'Total Products', value: productStats.total },
                    { label: 'Active', value: productStats.active },
                    { label: 'Inactive', value: productStats.inactive },
                    { label: 'Filtered', value: productStats.filtered },
                    { label: 'Avg Price', value: `₹${productStats.averagePrice}` },
                    { label: 'Categories', value: productCategories.length },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-3 bg-white text-center shadow-sm"
                    >
                      <div className="font-semibold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Filter Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Search */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Search</label>
                      <div className="relative mt-1">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                          type="text"
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          placeholder="Search products..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={productFilterCategory}
                        onChange={(e) => setProductFilterCategory(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Categories</option>
                        {productCategories.map((c) => (
                          <option key={c} value={c}>
                            {categories[c]?.label || c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={productFilterStatus}
                        onChange={(e) => setProductFilterStatus(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sort By</label>
                      <div className="flex mt-1 space-x-2">
                        <select
                          value={productSortBy}
                          onChange={(e) => setProductSortBy(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="name">Name</option>
                          <option value="price">Price</option>
                          <option value="category">Category</option>
                          <option value="status">Status</option>
                        </select>

                        <button
                          onClick={() =>
                            setProductSortOrder(productSortOrder === 'asc' ? 'desc' : 'asc')
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          {productSortOrder === 'asc' ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Price Range */}
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Price Range (₹)</label>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        ['All', '', ''],
                        ['< ₹500', '', '500'],
                        ['₹501-₹1000', '501', '1000'],
                        ['₹1001-₹5000', '1001', '5000'],
                        ['> ₹5000', '5000', ''],
                      ].map(([label, min, max], idx) => (
                        <button
                          key={idx}
                          onClick={() => setProductPriceRange({ min, max })}
                          className={`px-3 py-1 text-xs rounded-full border transition ${productPriceRange.min === min && productPriceRange.max === max
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Cards */}
                {productsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 mx-auto rounded-full"></div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No products found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                      >
                        <div className="relative mb-4">
                          <img
                            src={
                              product.images?.[0]?.url ||
                              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300'
                            }
                            className="w-full rounded-lg"
                          />

                          <span
                            className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${product.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {categories[product.category]?.label || product.category}
                          </p>

                          <h4 className="font-semibold text-gray-900">{product.name}</h4>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex justify-between items-center mt-2">
                            <p className="font-bold text-blue-600 text-lg">
                              ₹{product.price?.base}
                            </p>

                            <p className="text-xs text-gray-500">
                              {product.reviewsCount || 0} reviews
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </p>

                            <div className="flex space-x-2">
                              {/* Toggle */}
                              <button
                                onClick={() =>
                                  handleToggleProductStatus(product._id, product.isActive)
                                }
                                className="text-gray-600 hover:text-blue-600 p-1"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setProductFormData({
                                    name: product.name,
                                    description: product.description,
                                    category: product.category,
                                    subcategory: product.subcategory || '',
                                    price: product.price,
                                    images: product.images,
                                    imageUrl: product.images?.[0]?.url || '',
                                    deliveryTime: product.deliveryTime,
                                  });
                                  setShowEditProductModal(true);
                                }}
                                className="text-gray-600 hover:text-blue-600 p-1"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-gray-600 hover:text-red-600 p-1"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            )}


            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900">Order Management</h3>
                  <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <div className="text-sm text-gray-500">
                      {ordersPagination.total > 0 && `${ordersPagination.total} total orders`}
                    </div>
                    <button
                      onClick={handleExportOrders}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5 inline mr-2" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Desktop Filters */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 hidden sm:block">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={ordersFilters.search}
                        onChange={(e) => handleOrdersFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <select
                      value={ordersFilters.status}
                      onChange={(e) => handleOrdersFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={ordersFilters.sortBy}
                      onChange={(e) => handleOrdersFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="createdAt">Date</option>
                      <option value="totalAmount">Amount</option>
                      <option value="status">Status</option>
                      <option value="orderNumber">Order Number</option>
                    </select>
                    <select
                      value={ordersFilters.sortOrder}
                      onChange={(e) => handleOrdersFilterChange('sortOrder', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>

                {/* Loading / Table / Cards */}
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading orders...</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="overflow-x-auto hidden sm:block">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 border-b border-gray-200">

                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (


                            <tr key={order._id} className="hover:bg-gray-100/40 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.orderNumber || `#${order._id.slice(-6)}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {getCustomerName(order)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{(() => {
                                  const items = (order.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
                                  return (items + (order.taxAmount || 0) + (order.shippingCost || 0)).toLocaleString('en-IN');
                                })()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                  className="text-xs font-medium rounded-md px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200"

                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowOrderDetailsModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Filters */}
                    <div className="sm:hidden mb-4 space-y-2">
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={ordersFilters.search}
                        onChange={(e) => handleOrdersFilterChange('search', e.target.value)}
                        className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={ordersFilters.status}
                          onChange={(e) => handleOrdersFilterChange('status', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <select
                          value={ordersFilters.sortBy}
                          onChange={(e) => handleOrdersFilterChange('sortBy', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="createdAt">Date</option>
                          <option value="totalAmount">Amount</option>
                          <option value="status">Status</option>
                          <option value="orderNumber">Order Number</option>
                        </select>
                        <select
                          value={ordersFilters.sortOrder}
                          onChange={(e) => handleOrdersFilterChange('sortOrder', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="desc">Newest First</option>
                          <option value="asc">Oldest First</option>
                        </select>
                      </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">{order.user?.name || order.shippingAddress?.name || 'N/A'}</span>
                            <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{order.orderNumber || `#${order._id.slice(-6)}`}</span>
                            <span className="text-sm text-gray-900">
                              ₹{(() => {
                                const items = (order.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
                                return (items + (order.taxAmount || 0) + (order.shippingCost || 0)).toLocaleString('en-IN');
                              })()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                              className={`text-xs font-semibold rounded px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderDetailsModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <div className="text-center text-gray-500 py-6">No orders found.</div>
                      )}
                    </div>
                  </>
                )}

                {/* ==================== ORDER DETAILS MODAL (inside same file) ==================== */}
                {showOrderDetailsModal && selectedOrder && (
                  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg w-full max-w-4xl my-8 max-h-screen overflow-y-auto overscroll-contain">

                      {/* Header */}
                      <div className="sticky top-0 bg-white border-b border-gray-100 p-5 px-6 shadow-sm flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          Order Details #{selectedOrder.orderNumber || selectedOrder._id}
                        </h2>
                        <button
                          onClick={() => {
                            setShowOrderDetailsModal(false);
                            setSelectedOrder(null);
                          }}
                          className="text-gray-400 hover:text-red-600 transition text-2xl"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="p-4 sm:p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">

                            {/* Order ID */}
                            <p className="text-gray-700">
                              <span className="font-semibold text-gray-900">Order ID:</span>{' '}
                              #{selectedOrder.orderNumber || selectedOrder._id}
                            </p>

                            {/* Placed On */}
                            <p className="text-gray-700">
                              <span className="font-semibold text-gray-900">Placed on:</span>{' '}
                              {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">Status:</span>
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(
                                  selectedOrder.status
                                )}`}
                              >
                                {String(selectedOrder.status || '')
                                  .replace('-', ' ')
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                            </div>
                          </div>
                        </div>


                        {/* Order Items */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                            Order Items
                          </h3>

                          <div className="space-y-3">
                            {(selectedOrder.items || []).map((item, i) => (
                              <div
                                key={i}
                                className="flex gap-4 bg-gray-100 border border-gray-200 p-4 rounded-xl shadow-sm"
                              >
                                {/* Product Image */}
                                <img
                                  src={
                                    item.product?.images?.[0]?.url ||
                                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop'
                                  }
                                  alt={item.product?.name}
                                  className="h-20 w-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                />

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 text-sm truncate">
                                    {item.product?.name || 'Product'}
                                  </h4>

                                  <p className="text-xs text-gray-600 mt-1">
                                    Qty: <span className="font-semibold text-gray-800">{item.quantity}</span>
                                    <span className="mx-1 text-gray-400">•</span>
                                    Tier: <span className="font-semibold text-gray-800">{item.tier || 'Standard'}</span>
                                  </p>

                                  <p className="text-xs text-gray-600">
                                    Price: ₹{(item.price || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>

                                {/* Total */}
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900 text-sm">
                                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>


                        {/* Shipping Address */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPinIcon className="h-5 w-5 text-blue-600" />
                            Shipping Address
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <UserIcon className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Name:</span>{' '}
                              <span>{selectedOrder.shippingAddress?.fullName || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <PhoneIcon className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Phone:</span>{' '}
                              <span>{selectedOrder.shippingAddress?.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-start gap-2 text-gray-700">
                              <MapPinIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="font-medium">Address:</span>{' '}
                              <span>
                                {[
                                  selectedOrder.shippingAddress?.address || selectedOrder.shippingAddress?.street,
                                  selectedOrder.shippingAddress?.city,
                                  selectedOrder.shippingAddress?.state,
                                  selectedOrder.shippingAddress?.pincode,
                                  selectedOrder.shippingAddress?.country,
                                ]
                                  .filter(Boolean)
                                  .join(', ') || 'Not provided'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CreditCardIcon className="h-5 w-5 text-blue-600" />
                            Payment Details
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                            <p className="flex justify-between text-gray-700">
                              <span className="font-medium">Method:</span>
                              <span className="capitalize">
                                {detectPaymentMethod()}
                              </span>
                            </p>
                            <p className="flex justify-between text-gray-700">
                              <span className="font-medium">Status:</span>
                              <span
                                className={`capitalize font-medium ${selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                  }`}
                              >
                                {selectedOrder.paymentStatus || 'Pending'}
                              </span>
                            </p>
                            <p className="flex justify-between text-gray-700">
                              <span className="font-medium">Transaction ID:</span>
                              <span className="font-mono text-xs">
                                {selectedOrder.paymentId || 'N/A'}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Items Total</span>
                            <span>
                              ₹{(selectedOrder.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>₹{(selectedOrder.taxAmount || 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{(selectedOrder.shippingCost || 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-300">
                            <span>Total</span>
                            <span className="text-green-600">
                              ₹{(() => {
                                const items = (selectedOrder.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
                                return (items + (selectedOrder.taxAmount || 0) + (selectedOrder.shippingCost || 0)).toLocaleString('en-IN');
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end pt-4">
                          <button
                            onClick={() => {
                              setShowOrderDetailsModal(false);
                              setSelectedOrder(null);
                            }}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* Logo Requests Tab */}
            {activeTab === 'logo-requests' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Logo Requests</h3>

                  <button
                    onClick={handleExportLogoRequests}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 inline mr-2" />
                    Export CSV
                  </button>
                </div>

                {/* Loading */}
                {logoRequestsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading logo requests...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {logoRequests.map((request) => (
                      <div
                        key={request._id}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                      >

                        {/* Title + Status */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {request.businessName}
                            </h4>
                            <p className="text-sm text-gray-500">{request.industry}</p>
                          </div>

                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status.replace('-', ' ')}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                          {request.description}
                        </p>

                        {/* Reference Images */}
                        {request.referenceImages?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                              Reference Images
                            </p>

                            <div className="flex space-x-2">
                              {request.referenceImages.slice(0, 3).map((img, index) => (
                                <img
                                  key={index}
                                  src={img}
                                  alt={`ref-${index}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform duration-200"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Date + Status Selector */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>

                          <select
                            value={request.status}
                            onChange={(e) =>
                              handleLogoRequestStatusChange(request._id, e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            )}


            {/* Embroidery Requests Tab */}
            {activeTab === 'embroidery-requests' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Embroidery Requests</h3>
                  <button
                    onClick={handleExportEmbroideryRequests}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 inline mr-2" />
                    Export CSV
                  </button>
                </div>
                {embroideryRequestsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading embroidery requests...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {embroideryRequests.map((request) => (
                      <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{request.designName}</h4>
                            <p className="text-sm text-gray-600">{request.embroideryType}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{request.description}</p>
                        {request.designImages && request.designImages.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Design Images:</p>
                            <div className="flex space-x-2">
                              {request.designImages.slice(0, 3).map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Design ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <select
                              value={request.status}
                              onChange={(e) => handleEmbroideryRequestStatusChange(request._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Design Orders Tab */}
            {activeTab === 'custom-design-orders' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Custom Design Orders</h3>
                  <button
                    onClick={handleExportCustomDesignOrders}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                </div>
                {customDesignOrdersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading custom design orders...</p>
                  </div>
                ) : customDesignOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No custom design orders found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {customDesignOrders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{order.product?.name || 'Unknown Product'}</h4>
                            <p className="text-sm text-gray-600">Order #{order.orderNumber || order._id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">Customer: {order.user?.name || 'Unknown'}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status || 'pending'}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-sm"><span className="font-medium">Design Type:</span> {order.designType}</p>
                          <p className="text-sm"><span className="font-medium">Quantity:</span> {order.quantity}</p>
                          {order.pricing && (
                            <p className="text-sm"><span className="font-medium">Total:</span> ₹{order.pricing.total}</p>
                          )}
                        </div>

                        {order.uploadedDesign && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Design:</p>
                            <div className="flex items-center space-x-3">
                              <img
                                src={order.uploadedDesign.url}
                                alt="Uploaded design"
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{order.uploadedDesign.originalName}</p>
                                <p className="text-xs text-gray-500">
                                  {(order.uploadedDesign.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}



            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900">Review Management</h3>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    {reviewStats && Object.keys(reviewStats).length > 0 && (
                      <div className="flex space-x-2 flex-wrap">
                        {Object.entries(reviewStats).map(([status, count]) => (
                          <span key={status} className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${status === 'approved' ? 'bg-green-100 text-green-800' :
                            status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {status}: {count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading reviews...</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Cards */}
                    <div className="hidden sm:block space-y-4">
                      {reviews.map((review) => (
                        <div key={review._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{review.user?.name || 'Anonymous'}</span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${review.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                  {review.status}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Product: {review.product?.name || 'Unknown'}</span>
                                <span>•</span>
                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                {review.helpfulVotes > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{review.helpfulVotes} helpful votes</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <select
                                value={review.status}
                                onChange={(e) => handleReviewStatusChange(review._id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                              {/* <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button> */}
                            </div>
                          </div>
                          {review.images && review.images.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">Images:</p>
                              <div className="flex space-x-2">
                                {review.images.slice(0, 3).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Review ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-4">
                      {reviews.map((review) => (
                        <div key={review._id} className="border border-gray-200 rounded-lg p-4 flex flex-col space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">{review.user?.name || 'Anonymous'}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${review.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                  {review.status}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                              <p className="text-gray-700 text-sm mb-2 line-clamp-3">{review.comment}</p>
                              <div className="flex flex-wrap text-xs text-gray-500 space-x-2">
                                <span>Product: {review.product?.name || 'Unknown'}</span>
                                <span>•</span>
                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                {review.helpfulVotes > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{review.helpfulVotes} helpful votes</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-2">
                            <select
                              value={review.status}
                              onChange={(e) => handleReviewStatusChange(review._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>

                          {/* Images */}
                          {review.images && review.images.length > 0 && (
                            <div className="mt-2 flex space-x-2 overflow-x-auto">
                              {review.images.slice(0, 3).map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {reviews.length === 0 && (
                        <div className="text-center text-gray-500 py-6">
                          No reviews found.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'view-contact-messages' && (
              <AdminContactMessages />
            )}

          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{user?.name}</h4>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mt-2">
                  {user?.role}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle profile update logic here
                  toast.success('Profile updated successfully')
                  setShowProfileModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout? You will need to login again to access the admin panel.</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false)
                  handleLogout()
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false)
                  setUserFormData({ name: '', email: '', role: 'user' })
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddUserModal(false)
                  setUserFormData({ name: '', email: '', role: 'user' })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
              <button
                onClick={() => {
                  setShowEditUserModal(false)
                  setSelectedUser(null)
                  setUserFormData({ name: '', email: '', role: 'user' })
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditUserModal(false)
                  setSelectedUser(null)
                  setUserFormData({ name: '', email: '', role: 'user' })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => {
                  setShowAddProductModal(false)
                  setProductFormData({
                    name: '',
                    description: '',
                    category: '',
                    subcategory: '',
                    price: { base: 0, premium: 0, enterprise: 0 },
                    images: [],
                    deliveryTime: { base: 7, premium: 5, enterprise: 3 }
                  })
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Base Price</label>
                    <input
                      type="number"
                      value={productFormData.price.base}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        price: { ...productFormData.price, base: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Premium Price</label>
                    <input
                      type="number"
                      value={productFormData.price.premium}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        price: { ...productFormData.price, premium: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Premium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Enterprise Price</label>
                    <input
                      type="number"
                      value={productFormData.price.enterprise}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        price: { ...productFormData.price, enterprise: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enterprise"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={productFormData.category}
                  onChange={(e) => {
                    setProductFormData({
                      ...productFormData,
                      category: e.target.value,
                      subcategory: '' // Reset subcategory when category changes
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {Object.entries(categories).map(([key, category]) => (
                    <option key={key} value={key}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select
                  value={productFormData.subcategory}
                  onChange={(e) => setProductFormData({ ...productFormData, subcategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!productFormData.category}
                >
                  <option value="">Select a subcategory</option>
                  {productFormData.category && categories[productFormData.category]?.subcategories.map((subcategory) => (
                    <option key={subcategory.value} value={subcategory.value}>{subcategory.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL or Upload</label>

                {/* URL Input */}
                <div className="mb-3">
                  <input
                    type="url"
                    value={productFormData.imageUrl || ''}
                    onChange={(e) => {
                      setProductFormData({ ...productFormData, imageUrl: e.target.value });
                      // Clear file preview when typing URL
                      if (e.target.value) {
                        setImagePreview('');
                        setSelectedFile(null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product image URL"
                  />
                </div>

                {/* File Upload */}
                <div className="mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={isUploading}
                    />
                    {(imagePreview || productFormData.imageUrl) && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {isUploading && (
                    <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
                  )}
                </div>

                {/* Image Preview */}
                {(imagePreview || productFormData.imageUrl) && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img
                      src={imagePreview || productFormData.imageUrl}
                      alt="Preview"
                      className="rounded-lg border h-32 w-32 object-cover shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        toast.error('Failed to load image preview');
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time (Days)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Base</label>
                    <input
                      type="number"
                      min="1"
                      value={productFormData.deliveryTime.base}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        deliveryTime: { ...productFormData.deliveryTime, base: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="7"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Premium</label>
                    <input
                      type="number"
                      min="1"
                      value={productFormData.deliveryTime.premium}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        deliveryTime: { ...productFormData.deliveryTime, premium: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Enterprise</label>
                    <input
                      type="number"
                      min="1"
                      value={productFormData.deliveryTime.enterprise}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        deliveryTime: { ...productFormData.deliveryTime, enterprise: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddProductModal(false)
                  setProductFormData({
                    name: '',
                    description: '',
                    category: '',
                    subcategory: '',
                    price: { base: 0, premium: 0, enterprise: 0 },
                    images: [],
                    deliveryTime: { base: 7, premium: 5, enterprise: 3 }
                  })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
              <button
                onClick={() => {
                  setShowEditProductModal(false)
                  setSelectedProduct(null)
                  setProductFormData({
                    name: '',
                    description: '',
                    category: '',
                    subcategory: '',
                    price: { base: 0, premium: 0, enterprise: 0 },
                    images: [],
                    imageUrl: '',
                    deliveryTime: { base: 7, premium: 5, enterprise: 3 }
                  })
                  // Clear image preview states
                  setImagePreview('')
                  setSelectedFile(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Base Price</label>
                    <input
                      type="number"
                      value={productFormData.price.base}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        price: { ...productFormData.price, base: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Premium Price</label>
                    <input
                      type="number"
                      value={productFormData.price.premium}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        price: { ...productFormData.price, premium: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Premium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Enterprise Price</label>
                    <input
                      type="number"
                      value={productFormData.price.enterprise}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        price: { ...productFormData.price, enterprise: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enterprise"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={productFormData.category}
                  onChange={(e) => {
                    setProductFormData({
                      ...productFormData,
                      category: e.target.value,
                      subcategory: '' // Reset subcategory when category changes
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {Object.entries(categories).map(([key, category]) => (
                    <option key={key} value={key}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select
                  value={productFormData.subcategory}
                  onChange={(e) => setProductFormData({ ...productFormData, subcategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!productFormData.category}
                >
                  <option value="">Select a subcategory</option>
                  {productFormData.category && categories[productFormData.category]?.subcategories.map((subcategory) => (
                    <option key={subcategory.value} value={subcategory.value}>{subcategory.label}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Time Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time (Days)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Base</label>
                    <input
                      type="number"
                      value={productFormData.deliveryTime.base}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        deliveryTime: { ...productFormData.deliveryTime, base: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Base"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Premium</label>
                    <input
                      type="number"
                      value={productFormData.deliveryTime.premium}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        deliveryTime: { ...productFormData.deliveryTime, premium: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Premium"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Enterprise</label>
                    <input
                      type="number"
                      value={productFormData.deliveryTime.enterprise}
                      onChange={(e) => setProductFormData({
                        ...productFormData,
                        deliveryTime: { ...productFormData.deliveryTime, enterprise: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enterprise"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {(imagePreview || productFormData.imageUrl) && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {(imagePreview || productFormData.imageUrl) && (
                    <div className="mt-3">
                      <img
                        src={imagePreview || productFormData.imageUrl}
                        alt="Product preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}

                  {/* Manual URL Input */}
                  <div className="text-center text-sm text-gray-500">or</div>
                  <div>
                    <input
                      type="url"
                      value={productFormData.imageUrl}
                      onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product image URL"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditProductModal(false)
                  setSelectedProduct(null)
                  setProductFormData({
                    name: '',
                    description: '',
                    category: '',
                    subcategory: '',
                    price: { base: 0, premium: 0, enterprise: 0 },
                    images: [],
                    imageUrl: '',
                    deliveryTime: { base: 7, premium: 5, enterprise: 3 }
                  })
                  // Clear image preview states
                  setImagePreview('')
                  setSelectedFile(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default AdminDashboard