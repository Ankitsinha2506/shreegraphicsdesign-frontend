// components/LogoRequestsList.jsx - INDUSTRIAL PROFESSIONAL 2025
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';
import { PaintBrushIcon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const LogoRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/custom-logo-requests/my-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const list = data.data || data.requests || data || [];
      setRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load logo requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'in-progress' || s === 'in_progress') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'under-review' || s === 'pending') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s === 'cancelled') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Custom Logo Requests
        </h2>
        <p className="mt-3 text-lg text-gray-600">Track your brand identity journey</p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-6 text-gray-600">Loading your logo requests...</p>
        </div>
      ) : requests.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl shadow-xl border-2 border-orange-200 p-16 text-center">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-8">
            <PaintBrushIcon className="w-16 h-16 text-orange-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">No Logo Requests Yet</h3>
          <p className="text-gray-600 mb-10 max-w-md mx-auto">
            Start building your brand identity with a professional custom logo designed just for you.
          </p>
          <a
            href="/custom-logo-request"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl rounded-full shadow-2xl transition transform hover:scale-105"
          >
            <PaintBrushIcon className="w-7 h-7" />
            Create Logo Request
          </a>
        </div>
      ) : (
        /* Requests Grid */
        <div className="grid gap-8 md:grid-cols-2">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-3xl shadow-xl border-2 border-orange-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black">{req.businessName}</h3>
                    <p className="text-orange-100 mt-1">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusBadge(req.status)} text-gray-800`}>
                    {req.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Price */}
                <div className="text-right">
                  <p className="text-3xl font-black text-orange-600">
                    ₹{(req.estimatedPrice || req.price || 0).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-bold text-gray-700">Industry</p>
                    <p className="text-gray-600">{req.industry || '—'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">Package</p>
                    <p className="text-gray-600">{req.packageType || req.selectedPackage || 'Standard'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">Style</p>
                    <p className="text-gray-600">{req.designStyle || req.logoStyle || 'Modern'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">Colors</p>
                    <p className="text-gray-600">
                      {Array.isArray(req.colorPreferences)
                        ? req.colorPreferences.join(', ')
                        : req.colorPreferences || 'Any'}
                    </p>
                  </div>
                </div>

                {/* Reference Images */}
                {req.referenceImages && req.referenceImages.length > 0 && (
                  <div>
                    <p className="font-bold text-gray-700 mb-3">Reference Images</p>
                    <div className="grid grid-cols-4 gap-3">
                      {req.referenceImages.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={`${API_URL}${img}`}
                          alt="ref"
                          className="w-full h-20 object-cover rounded-xl border-2 border-orange-100 shadow-md"
                        />
                      ))}
                      {req.referenceImages.length > 4 && (
                        <div className="w-full h-20 bg-orange-100 rounded-xl flex items-center justify-center text-orange-700 font-bold text-2xl">
                          +{req.referenceImages.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="flex-1 py-4 bg-white border-2 border-orange-400 text-orange-700 hover:bg-orange-50 font-bold rounded-2xl transition"
                  >
                    View Details
                  </button>
                  {req.status === 'completed' && req.finalDesigns && (
                    <button className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-2">
                      <ArrowDownTrayIcon className="w-6 h-6" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL - FULL DETAILS */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-3xl border-4 border-orange-200 max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <h2 className="text-3xl font-black">Logo Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-3 hover:bg-white/20 rounded-full transition"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-black text-gray-800">{selectedRequest.businessName}</h3>
                <p className="text-gray-600 mt-2">
                  Submitted on {new Date(selectedRequest.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <span className={`inline-block mt-4 px-6 py-3 rounded-full text-lg font-bold ${getStatusBadge(selectedRequest.status)}`}>
                  {selectedRequest.status?.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                  <h4 className="font-bold text-xl text-orange-700 mb-4">Business Info</h4>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Industry:</strong> {selectedRequest.industry}</p>
                    <p><strong>Package:</strong> {selectedRequest.packageType || selectedRequest.selectedPackage}</p>
                    {selectedRequest.website && <p><strong>Website:</strong> <a href={selectedRequest.website} className="text-orange-600 underline">{selectedRequest.website}</a></p>}
                    <p><strong>Price:</strong> <span className="text-2xl font-black text-orange-600">₹{(selectedRequest.estimatedPrice || selectedRequest.price || 0).toLocaleString()}</span></p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                  <h4 className="font-bold text-xl text-orange-700 mb-4">Design Preferences</h4>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Style:</strong> {selectedRequest.designStyle || selectedRequest.logoStyle}</p>
                    <p><strong>Colors:</strong> {Array.isArray(selectedRequest.colorPreferences) ? selectedRequest.colorPreferences.join(', ') : selectedRequest.colorPreferences}</p>
                    {selectedRequest.targetAudience && <p><strong>Audience:</strong> {selectedRequest.targetAudience}</p>}
                  </div>
                </div>
              </div>

              {selectedRequest.description && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-bold text-xl text-gray-800 mb-3">Project Brief</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedRequest.description}</p>
                </div>
              )}

              {selectedRequest.referenceImages && selectedRequest.referenceImages.length > 0 && (
                <div>
                  <h4 className="font-bold text-xl text-gray-800 mb-4">Reference Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedRequest.referenceImages.map((img, i) => (
                      <img
                        key={i}
                        src={`${API_URL}${img}`}
                        alt="reference"
                        className="w-full h-48 object-cover rounded-2xl border-4 border-white shadow-xl"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center pt-6">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-12 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xl rounded-full shadow-2xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoRequestsList;