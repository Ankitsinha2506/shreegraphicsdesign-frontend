// 🔥 Updated: components/admin/AdminPodcasts.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

const AdminPodcasts = () => {
  const { token, user } = useAuth();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoType: 'upload',
    videoUrl: '',
    videoFile: null,
    thumbnail: null,
  });

  const authHeaders = {
    Authorization: `Bearer ${token || localStorage.getItem('token')}`,
  };

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/podcasts`, {
        headers: authHeaders,
      });
      if (res.data.success) {
        setPodcasts(res.data.podcasts || []);
      }
    } catch (err) {
      toast.error('Failed to load podcasts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchPodcasts();
  }, [user]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoType: 'upload',
      videoUrl: '',
      videoFile: null,
      thumbnail: null,
    });
    setEditingPodcast(null);
  };

  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (podcast) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title,
      description: podcast.description || '',
      videoType: podcast.videoType,
      videoUrl: podcast.videoType === 'url' ? podcast.videoUrl : '',
      videoFile: null,
      thumbnail: null,
    });
    setFormOpen(true);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error('Title is required');
    if (formData.videoType === 'url' && !formData.videoUrl.trim())
      return toast.error('Video URL is required');

    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('videoType', formData.videoType);

      if (formData.videoType === 'url') {
        fd.append('videoUrl', formData.videoUrl.trim());
      } else if (formData.videoType === 'upload' && formData.videoFile) {
        fd.append('videoFile', formData.videoFile);
      }

      if (formData.thumbnail) fd.append('thumbnail', formData.thumbnail);

      if (editingPodcast) {
        await axios.put(`${API_URL}/api/podcasts/${editingPodcast._id}`, fd, {
          headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Podcast updated');
      } else {
        await axios.post(`${API_URL}/api/podcasts`, fd, {
          headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Podcast created');
      }

      setFormOpen(false);
      resetForm();
      fetchPodcasts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save podcast');
    }
  };

  const handleDelete = async (podcastId) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(`${API_URL}/api/podcasts/${podcastId}`, {
        headers: authHeaders,
      });

      setPodcasts((prev) => prev.filter((p) => p._id !== podcastId));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete podcast');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <p className="text-gray-500 text-sm">
          You do not have permission to manage podcasts.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <VideoCameraIcon className="h-5 w-5 text-blue-600" />
          Podcast Management
        </h3>

        <button
          onClick={openCreateForm}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Podcast
        </button>
      </div>

      {/* Podcast List */}
      {!loading && podcasts.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No podcasts found.
        </div>
      )}

      {!loading &&
        podcasts.map((podcast) => (
          <div
            key={podcast._id}
            className="border border-gray-200 rounded-xl p-4 flex gap-4"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              {podcast.thumbnailUrl ? (
                <img
                  src={
                    podcast.thumbnailUrl.startsWith('/uploads') // 🔥 FIXED
                      ? `${API_URL}${podcast.thumbnailUrl}`
                      : podcast.thumbnailUrl
                  }
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-1">
                  No Thumbnail
                </div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{podcast.title}</h4>

              <p className="text-xs text-gray-500 mt-0.5">
                {podcast.videoType === 'upload'
                  ? 'Uploaded video'
                  : 'External URL'}
              </p>

              {podcast.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {podcast.description}
                </p>
              )}

              <p className="text-[11px] text-gray-400 mt-1">
                Created: {new Date(podcast.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => openEditForm(podcast)}
                className="p-2 rounded-md border text-gray-600 hover:text-blue-600"
              >
                <PencilIcon className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDelete(podcast._id)}
                className="p-2 rounded-md border text-gray-600 hover:text-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        </div>
      )}

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPodcast ? 'Edit Podcast' : 'Add Podcast'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Video Type */}
              <div>
                <label className="block text-xs">Video Type *</label>
                <div className="flex gap-3 mt-1">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      value="upload"
                      checked={formData.videoType === 'upload'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          videoType: e.target.value,
                        }))
                      }
                    />
                    Upload
                  </label>

                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      value="url"
                      checked={formData.videoType === 'url'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          videoType: e.target.value,
                        }))
                      }
                    />
                    URL
                  </label>
                </div>
              </div>

              {/* Upload or URL */}
              {formData.videoType === 'upload' ? (
                <div>
                  <label className="block text-xs">Video File *</label>
                  <input
                    type="file"
                    name="videoFile"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs">Video URL *</label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        videoUrl: e.target.value,
                      }))
                    }
                    placeholder="https://youtube.com/..."
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
              )}

              {/* Thumbnail */}
              <div>
                <label className="block text-xs">Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-md"
                >
                  {editingPodcast ? 'Save Changes' : 'Create Podcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPodcasts;
