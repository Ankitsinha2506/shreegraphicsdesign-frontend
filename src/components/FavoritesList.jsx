// 6. FavoritesList.jsx (placeholder, as original is empty - add fetch if needed)
import { HeartIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]); // Fetch from backend if implemented

  const btnPrimary = 'inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-[0_6px_25px_rgba(255,0,0,0.25)]';

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-300 mb-4">Favorite Items</h2>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg text-gray-100">No favorites yet</h3>
          <p className="mt-2 text-sm text-gray-400">Save items you love to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map(item => (
            <div key={item.id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
              <div className="aspect-square w-full overflow-hidden rounded-md mb-3 bg-zinc-800">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100">{item.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{item.category}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-100">₹{item.price}</div>
                  <button className={`${btnPrimary} text-sm`}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;