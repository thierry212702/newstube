import { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../components/video/NewsCard';
import { FaFire } from 'react-icons/fa';

export default function Trending() {
  const [articles, setArticles] = useState([]);
  const [timeFilter, setTimeFilter] = useState('today');

  useEffect(() => {
    fetchTrending();
  }, [timeFilter]);

  const fetchTrending = async () => {
    const response = await axios.get('/api/news/trending');
    setArticles(response.data);
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FaFire className="text-red-600 text-3xl" />
        <h1 className="text-2xl font-bold">Trending</h1>
      </div>
      
      {/* Time filters */}
      <div className="flex space-x-2 mb-6">
        {['Now', 'Today', 'This Week', 'This Month'].map(filter => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter.toLowerCase())}
            className={`px-4 py-2 rounded-full ${
              timeFilter === filter.toLowerCase() 
                ? 'bg-black text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      {/* Trending list with numbers */}
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={article._id} className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-gray-400 w-12 text-right">
              #{index + 1}
            </div>
            <div className="flex-1">
              <NewsCard article={article} viewMode="list" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}