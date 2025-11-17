// 3. LogoRequestsList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';
import { PaintBrushIcon } from '@heroicons/react/24/outline';

const LogoRequestsList = () => {
  const [logoRequests, setLogoRequests] = useState([]);
  const [logoRequestsLoading, setLogoRequestsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchLogoRequests();
  }, []);

  const fetchLogoRequests = async () => {
    setLogoRequestsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/custom-logo-requests/my-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = response.data.data || response.data.requests || response.data || [];
      setLogoRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching logo requests:', error);
      toast.error('Failed to fetch logo requests');
      setLogoRequests([]);
    } finally {
      setLogoRequestsLoading(false);
    }
  };

  const btnPrimary = 'inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-[0_6px_25px_rgba(255,0,0,0.25)]';
  const btnSecondary = 'inline-flex items-center justify-center bg-transparent border border-red-800 text-red-300 py-2 px-4 rounded-lg hover:bg-red-900/20 transition';

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-300 mb-4">Custom Logo Requests</h2>

      {logoRequestsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-400">Loading logo requests...</p>
        </div>
      ) : logoRequests.length === 0 ? (
        <div className="text-center py-12">
          <PaintBrushIcon className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg text-gray-100">No logo requests yet</h3>
          <p className="mt-2 text-sm text-gray-400">Submit a custom logo request to see it here.</p>
          <div className="mt-6">
            <a href="/custom-logo-request" className={btnPrimary}>Create Logo Request</a>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {logoRequests.map(request => (
            <div key={request._id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{request.businessName}</h3>
                  <p className="text-sm text-gray-400">Submitted on {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${request.status === 'completed' ? 'text-green-600 bg-green-100' : request.status === 'in-progress' ? 'text-blue-600 bg-blue-100' : request.status === 'under-review' ? 'text-yellow-600 bg-yellow-100' : 'text-gray-600 bg-gray-100'}`}>
                    {String(request.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <p className="text-lg font-bold text-gray-100 mt-1">₹{(request.estimatedPrice || request.price || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-300 font-medium mb-1">Business Details</div>
                  <p className="text-sm text-gray-400">Industry: {request.industry}</p>
                  <p className="text-sm text-gray-400">Package: {request.packageType || request.selectedPackage}</p>
                  {request.website && <p className="text-sm text-gray-400">Website: {request.website}</p>}
                </div>

                <div>
                  <div className="text-sm text-gray-300 font-medium mb-1">Design Preferences</div>
                  <p className="text-sm text-gray-400">Style: {request.designStyle || request.logoStyle}</p>
                  <p className="text-sm text-gray-400">Colors: {Array.isArray(request.colorPreferences) ? request.colorPreferences.join(', ') : request.colorPreferences}</p>
                  {request.targetAudience && <p className="text-sm text-gray-400">Target: {request.targetAudience}</p>}
                </div>
              </div>

              {request.description && (
                <div className="mt-3">
                  <div className="text-sm text-gray-300 font-medium mb-1">Description</div>
                  <p className="text-sm text-gray-400">{request.description}</p>
                </div>
              )}

              {request.referenceImages && request.referenceImages.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm text-gray-300 font-medium mb-2">Reference Images</div>
                  <div className="flex gap-2">
                    {request.referenceImages.slice(0, 4).map((img, idx) => (
                      <img key={idx} src={`${API_URL}${img}`} alt={`ref-${idx}`} className="h-16 w-16 object-cover rounded-md" />
                    ))}
                    {request.referenceImages.length > 4 && (
                      <div className="h-16 w-16 rounded-md bg-zinc-900 border border-red-900/20 flex items-center justify-center text-sm text-gray-400">+{request.referenceImages.length - 4}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button onClick={() => setSelectedRequest(request)} className={`${btnSecondary} text-sm`}>View Details</button>
                {request.status === 'completed' && request.finalDesigns && <button className={`${btnPrimary} text-sm`}>Download Designs</button>}
                {/* {request.status === 'in-progress' && <button className={`${btnSecondary} text-sm`}>Add Revision</button>} */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logo Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-zinc-950 border border-red-900/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-6 max-w-3xl w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-300">Logo Request Details: {selectedRequest.businessName}</h2>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-red-300">✕</button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Submitted on {new Date(selectedRequest.createdAt).toLocaleDateString()} • Status: <span className={`font-semibold px-2 py-1 rounded-full ${selectedRequest.status === 'completed' ? 'text-green-600 bg-green-100' : selectedRequest.status === 'in-progress' ? 'text-blue-600 bg-blue-100' : 'text-yellow-600 bg-yellow-100'}`}>{String(selectedRequest.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">Business Details</h3>
                <p className="text-sm text-gray-400">Industry: {selectedRequest.industry}</p>
                <p className="text-sm text-gray-400">Package: {selectedRequest.packageType || selectedRequest.selectedPackage}</p>
                {selectedRequest.website && <p className="text-sm text-gray-400">Website: <a href={selectedRequest.website} className="text-red-400">{selectedRequest.website}</a></p>}
                <p className="text-sm text-gray-400">Estimated Price: ₹{(selectedRequest.estimatedPrice || selectedRequest.price || 0).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">Design Preferences</h3>
                <p className="text-sm text-gray-400">Style: {selectedRequest.designStyle || selectedRequest.logoStyle}</p>
                <p className="text-sm text-gray-400">Colors: {Array.isArray(selectedRequest.colorPreferences) ? selectedRequest.colorPreferences.join(', ') : selectedRequest.colorPreferences}</p>
                {selectedRequest.targetAudience && <p className="text-sm text-gray-400">Target Audience: {selectedRequest.targetAudience}</p>}
              </div>
            </div>
            {selectedRequest.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-100 mb-2">Description</h3>
                <p className="text-sm text-gray-400">{selectedRequest.description}</p>
              </div>
            )}
            {selectedRequest.referenceImages && selectedRequest.referenceImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-100 mb-2">Reference Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedRequest.referenceImages.map((img, idx) => (
                    <img key={idx} src={`${API_URL}${img}`} alt={`ref-${idx}`} className="h-32 w-full object-cover rounded-md" />
                  ))}
                </div>
              </div>
            )}
            {/* Add more details like revisions, final designs if available */}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedRequest(null)} className={btnSecondary}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoRequestsList;