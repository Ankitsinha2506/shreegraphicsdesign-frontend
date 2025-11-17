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
      active: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50',
      inactive: 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/50',
      prospect: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
      archived: 'bg-red-500/20 text-red-400 border border-red-500/50'
    }
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${styles[status] || 'bg-zinc-700 text-zinc-400'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    )
  }

  const getTypeBadge = (type) => {
    const styles = {
      individual: 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
      'small-business': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50',
      enterprise: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50',
      'non-profit': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
    }
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${styles[type] || 'bg-zinc-700 text-zinc-400'}`}>
        {type?.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
      </span>
    )
  }

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen bg-black flex items-center justify-center text-4xl text-red-500">Access Denied</div>
  }

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-8 border-red-600 border-t-transparent"></div>
    </div>
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                Client Management
              </h1>
              <p className="text-lg text-zinc-400 mt-2">Manage clients & track projects efficiently</p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-8 py-4 rounded-xl font-semibold shadow-xl shadow-red-900/40 transition hover:scale-105 flex items-center gap-3">
              <PlusIcon className="h-6 w-6" /> Add New Client
            </button>
          </div>

          {/* Filters */}
          <div className="bg-zinc-950/90 backdrop-blur-xl border border-red-800/40 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <input
                  type="text" placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition placeholder-zinc-500 text-white text-sm"
                />
              </div>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-sm">
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-sm">
                {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-sm">
                {industryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="mt-5 flex items-center gap-2 text-zinc-400">
              <FunnelIcon className="h-5 w-5 text-red-500" />
              <span className="font-semibold">{clients.length} clients</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-zinc-950/90 backdrop-blur-xl border border-red-800/40 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-900/40 to-black">
                  <tr>
                    {['Client', 'Contact', 'Type & Status', 'Industry', 'Total Spent', 'Projects', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-red-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-900/20">
                  {clients.map(client => (
                    <tr key={client._id} className="hover:bg-red-900/10 transition">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-600 to-pink-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {client.name?.[0]?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{client.name}</div>
                            {client.company && <div className="text-sm text-zinc-400 flex items-center gap-1"><BuildingOfficeIcon className="h-4 w-4" />{client.company}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-zinc-300"><EnvelopeIcon className="h-4 w-4 text-red-500" />{client.email}</div>
                          <div className="flex items-center gap-2 text-zinc-400"><PhoneIcon className="h-4 w-4 text-red-500" />{client.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          {getTypeBadge(client.clientType)}
                          {getStatusBadge(client.status)}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-300">
                        {client.industry ? client.industry.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—'}
                      </td>
                      <td className="px-6 py-5 font-bold text-red-400">
                        ₹{(client.totalSpent || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-5 text-zinc-300 font-medium">
                        {client.projects?.length || 0}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <button onClick={() => openViewModal(client)} className="text-zinc-300 hover:text-white">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => openEditModal(client)} className="text-blue-400 hover:text-blue-300">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteClient(client._id)} className="text-red-500 hover:text-red-400">
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
              <div className="text-center py-20">
                <UserIcon className="h-20 w-20 mx-auto text-zinc-700 mb-6" />
                <h3 className="text-2xl font-bold text-zinc-400 mb-3">No Clients Found</h3>
                <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-8 py-4 rounded-xl font-semibold shadow-xl transition hover:scale-105">
                  Add Your First Client
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-800/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-red-800/30">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                {showEditModal ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button onClick={closeModals}><XMarkIcon className="h-8 w-8 text-zinc-400 hover:text-white" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-zinc-300 mb-2">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-white" placeholder="John Doe" />
                </div>
                <div><label className="block text-sm font-medium text-zinc-300 mb-2">Email *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-white" placeholder="john@example.com" />
                </div>
                <div><label className="block text-sm font-medium text-zinc-300 mb-2">Phone *</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-white" placeholder="+919876543210" />
                </div>
                <div><label className="block text-sm font-medium text-zinc-300 mb-2">Company</label>
                  <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-white" placeholder="ABC Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                    <CurrencyRupeeIcon className="h-5 w-5 text-red-500" /> Total Spent
                  </label>
                  <input type="number" min="0" value={formData.totalSpent} onChange={e => setFormData({...formData, totalSpent: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-white" placeholder="0" />
                </div>
                <div><label className="block text-sm font-medium text-zinc-300 mb-2">Client Type</label>
                  <select value={formData.clientType} onChange={e => setFormData({...formData, clientType: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-white">
                    {typeOptions.filter(t => t.value !== 'all').map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-zinc-300 mb-2">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-white">
                    {statusOptions.filter(s => s.value !== 'all').map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
                  <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-red-800/50 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition text-white">
                    {industryOptions.filter(i => i.value !== 'all').map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-red-800/30">
                <button type="button" onClick={closeModals} className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg font-bold shadow-lg transition hover:scale-105">
                  {showEditModal ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-800/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex justify-between p-6 border-b border-red-800/30">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">Client Details</h2>
              <button onClick={closeModals}><XMarkIcon className="h-8 w-8 text-zinc-400 hover:text-white" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-600 to-pink-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {selectedClient.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedClient.name}</h3>
                  {selectedClient.company && <p className="text-lg text-zinc-400">{selectedClient.company}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><EnvelopeIcon className="h-5 w-5 text-red-500" /><span className="text-zinc-300">{selectedClient.email}</span></div>
                  <div className="flex items-center gap-3"><PhoneIcon className="h-5 w-5 text-red-500" /><span className="text-zinc-300">{selectedClient.phone}</span></div>
                  <div className="flex items-center gap-3"><CalendarIcon className="h-5 w-5 text-red-500" /><span className="text-zinc-300">Joined: {new Date(selectedClient.createdAt).toLocaleDateString('en-IN')}</span></div>
                </div>
                <div className="space-y-4">
                  <div>Type: <span className="ml-2">{getTypeBadge(selectedClient.clientType)}</span></div>
                  <div>Status: <span className="ml-2">{getStatusBadge(selectedClient.status)}</span></div>
                  <div>Industry: <span className="text-zinc-300">{selectedClient.industry?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-red-800/30">
                <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-red-800/30">
                  <CurrencyRupeeIcon className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">Total Spent</p>
                  <p className="text-3xl font-bold text-red-400">₹{(selectedClient.totalSpent || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-red-800/30">
                  <FolderOpenIcon className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">Total Projects</p>
                  <p className="text-3xl font-bold text-red-400">{selectedClient.projects?.length || 0}</p>
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