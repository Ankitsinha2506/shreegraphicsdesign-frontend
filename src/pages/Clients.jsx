import React, { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  FolderOpenIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

const Clients = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('all')

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [editingClient, setEditingClient] = useState(null)

  // Form Data - Only fields that exist in your backend schema
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    phone: '', 
    company: '',
    clientType: 'individual', 
    status: 'active', 
    industry: 'other',
    totalSpent: 0
  })

  const { user } = useAuth()

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'archived', label: 'Archived' }
  ]

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'individual', label: 'Individual' },
    { value: 'small-business', label: 'Small Business' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'non-profit', label: 'Non-Profit' }
  ]

  const industryOptions = [
    { value: 'all', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'food-beverage', label: 'Food & Beverage' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'non-profit', label: 'Non-Profit' },
    { value: 'government', label: 'Government' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    if (user?.role === 'admin') fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, searchTerm, selectedStatus, selectedType, selectedIndustry])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (selectedType !== 'all') params.append('clientType', selectedType)
      if (selectedIndustry !== 'all') params.append('industry', selectedIndustry)

      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/clients?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setClients(response.data.data || [])
    } catch (error) {
      toast.error('Failed to load clients')
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Delete this client permanently?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Client deleted!')
      fetchClients()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cannot delete: Client has projects')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Name, Email & Phone are required!')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const payload = {
        ...formData,
        totalSpent: Number(formData.totalSpent) || 0
      }

      if (editingClient) {
        await axios.put(`${API_URL}/api/clients/${editingClient._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Client updated!')
        setShowEditModal(false)
      } else {
        await axios.post(`${API_URL}/api/clients`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Client added!')
        setShowAddModal(false)
      }
      resetForm()
      fetchClients()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', company: '',
      clientType: 'individual', status: 'active', industry: 'other',
      totalSpent: 0
    })
  }

  const openEditModal = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      clientType: client.clientType || 'individual',
      status: client.status || 'active',
      industry: client.industry || 'other',
      totalSpent: client.totalSpent || 0
    })
    setShowEditModal(true)
  }

  const openViewModal = (client) => {
    setSelectedClient(client)
    setShowViewModal(true)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setSelectedClient(null)
    setEditingClient(null)
    resetForm()
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border border-gray-200',
      prospect: 'bg-blue-100 text-blue-700 border border-blue-200',
      archived: 'bg-red-100 text-red-700 border border-red-200'
    }
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    )
  }

  const getTypeBadge = (type) => {
    const styles = {
      individual: 'bg-purple-100 text-purple-700 border border-purple-200',
      'small-business': 'bg-cyan-100 text-cyan-700 border border-cyan-200',
      enterprise: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      'non-profit': 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    }
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[type] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}
      >
        {type
          ?.split('-')
          .map(w => w[0].toUpperCase() + w.slice(1))
          .join(' ')}
      </span>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-3xl font-bold text-red-600">
        Access Denied
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Client Management
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Manage clients & track projects efficiently
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8 py-4 rounded-xl font-semibold shadow-lg shadow-orange-300/40 transition hover:scale-105 flex items-center gap-3 text-white"
            >
              <PlusIcon className="h-6 w-6" /> Add New Client
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white border border-orange-100 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition placeholder-gray-400 text-sm"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-sm"
              >
                {statusOptions.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-sm"
              >
                {typeOptions.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-sm"
              >
                {industryOptions.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5 flex items-center gap-2 text-gray-500">
              <FunnelIcon className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">{clients.length} clients</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-50 to-red-50">
                  <tr>
                    {['Client', 'Contact', 'Type & Status', 'Industry', 'Total Spent', 'Projects', 'Actions'].map(h => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients.map(client => (
                    <tr key={client._id} className="hover:bg-orange-50/50 transition">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {client.name?.[0]?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{client.name}</div>
                            {client.company && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                                {client.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-700">
                            <EnvelopeIcon className="h-4 w-4 text-orange-500" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <PhoneIcon className="h-4 w-4 text-orange-500" />
                            {client.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          {getTypeBadge(client.clientType)}
                          {getStatusBadge(client.status)}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {client.industry
                          ? client.industry
                              .replace(/-/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase())
                          : '—'}
                      </td>
                      <td className="px-6 py-5 font-bold text-red-600">
                        ₹{(client.totalSpent || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-5 text-gray-800 font-medium">
                        {client.projects?.length || 0}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => openViewModal(client)}
                            className="text-gray-500 hover:text-gray-800"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(client)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {clients.length === 0 && (
              <div className="text-center py-20 bg-gray-50">
                <UserIcon className="h-20 w-20 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-3">
                  No Clients Found
                </h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8 py-4 rounded-xl font-semibold shadow-lg shadow-orange-300/40 transition hover:scale-105 text-white"
                >
                  Add Your First Client
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                {showEditModal ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button onClick={closeModals}>
                <XMarkIcon className="h-8 w-8 text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-gray-900"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-gray-900"
                    placeholder="+919876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-gray-900"
                    placeholder="ABC Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CurrencyRupeeIcon className="h-5 w-5 text-orange-500" /> Total Spent
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalSpent}
                    onChange={e => setFormData({ ...formData, totalSpent: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-gray-900"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Type
                  </label>
                  <select
                    value={formData.clientType}
                    onChange={e => setFormData({ ...formData, clientType: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-gray-900"
                  >
                    {typeOptions
                      .filter(t => t.value !== 'all')
                      .map(t => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-gray-900"
                  >
                    {statusOptions
                      .filter(s => s.value !== 'all')
                      .map(s => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition text-gray-900"
                  >
                    {industryOptions
                      .filter(i => i.value !== 'all')
                      .map(i => (
                        <option key={i.value} value={i.value}>
                          {i.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-8 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg font-bold shadow-md shadow-orange-300/40 transition hover:scale-105 text-white"
                >
                  {showEditModal ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex justify-between p-6 border-b border-gray-100">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Client Details
              </h2>
              <button onClick={closeModals}>
                <XMarkIcon className="h-8 w-8 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {selectedClient.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedClient.name}
                  </h3>
                  {selectedClient.company && (
                    <p className="text-lg text-gray-500">
                      {selectedClient.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700">{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700">
                      Joined:{' '}
                      {selectedClient.createdAt
                        ? new Date(selectedClient.createdAt).toLocaleDateString('en-IN')
                        : '—'}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    Type: <span className="ml-2">{getTypeBadge(selectedClient.clientType)}</span>
                  </div>
                  <div>
                    Status:{' '}
                    <span className="ml-2">
                      {getStatusBadge(selectedClient.status)}
                    </span>
                  </div>
                  <div>
                    Industry:{' '}
                    <span className="text-gray-700">
                      {selectedClient.industry
                        ? selectedClient.industry
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase())
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
                  <CurrencyRupeeIcon className="h-10 w-10 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-3xl font-bold text-red-600">
                    ₹{(selectedClient.totalSpent || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
                  <FolderOpenIcon className="h-10 w-10 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Total Projects</p>
                  <p className="text-3xl font-bold text-red-600">
                    {selectedClient.projects?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Clients
