// 🔥 Updated: pages/PodcastsPage.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

const Podcasts = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePodcast, setActivePodcast] = useState(null);

  useEffect(() => {
    if (!user) return navigate('/login');

    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/podcasts`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token')}`,
          },
        });

        if (res.data.success) {
          setPodcasts(res.data.podcasts || []);
          if (res.data.podcasts.length > 0)
            setActivePodcast(res.data.podcasts[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [user]);

  const renderPlayer = () => {
    if (!activePodcast) return null;

    if (activePodcast.videoType === 'upload') {
      return (
        <video
          src={
            activePodcast.videoUrl.startsWith('/uploads') // 🔥 FIXED
              ? `${API_URL}${activePodcast.videoUrl}`
              : activePodcast.videoUrl
          }
          controls
          className="w-full rounded-xl border border-gray-200 bg-black max-h-[480px]"
        />
      );
    }

    // 🔥 Convert normal YouTube URL into embed URL
    let embedUrl = activePodcast.videoUrl;
    if (activePodcast.videoUrl.includes('youtube.com/watch')) {
      const url = new URL(activePodcast.videoUrl);
      const v = url.searchParams.get('v');
      if (v) embedUrl = `https://www.youtube.com/embed/${v}`;
    }

    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-black">
        <iframe
          src={embedUrl}
          title={activePodcast.title}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Podcasts</h1>

        {loading ? (
          <div className="text-center">Loading…</div>
        ) : podcasts.length === 0 ? (
          <p className="text-gray-600 text-center py-10">
            No podcasts available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">{renderPlayer()}</div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {podcasts.map((p) => (
                <button
                  key={p._id}
                  onClick={() => setActivePodcast(p)}
                  className={`w-full p-2 flex gap-3 border rounded-lg ${
                    activePodcast?._id === p._id
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {p.thumbnailUrl ? (
                      <img
                        src={
                          p.thumbnailUrl.startsWith('/uploads') // 🔥 FIXED
                            ? `${API_URL}${p.thumbnailUrl}`
                            : p.thumbnailUrl
                        }
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlayCircleIcon className="h-8 w-8 text-orange-500" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-gray-500">
                      {p.description || 'No description'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Podcasts;
