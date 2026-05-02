import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaShare, FaBookmark, FaClock, FaChartLine } from 'react-icons/fa';
import NewsCard from '../components/video/NewsCard';

export default function Watch() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchArticle();
    return () => {
      // Track watch time when leaving
      if (article) {
        const watchDuration = Math.floor((Date.now() - startTime) / 1000);
        axios.post('/api/news/watch-time', {
          userId: localStorage.getItem('userId'),
          articleId: id,
          watchDuration,
          completed: watchDuration >= article.readTime
        });
      }
    };
  }, [id]);

  const fetchArticle = async () => {
    const response = await axios.get(`/api/news/article/${id}`);
    setArticle(response.data.article);
    setRelated(response.data.related);
  };

  const handleEngage = async (action) => {
    await axios.post(`/api/news/engage/${id}/${action}`);
    if (action === 'like') setLiked(true);
    if (action === 'save') setSaved(true);
    
    // Update local stats
    setArticle({
      ...article,
      stats: {
        ...article.stats,
        [action === 'like' ? 'likes' : action === 'save' ? 'saves' : 'shares']: 
          article.stats[action === 'like' ? 'likes' : action === 'save' ? 'saves' : 'shares'] + 1
      }
    });
  };

  if (!article) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex">
      {/* Main Content - YouTube video player area */}
      <div className="flex-1 max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        
        {/* Channel info + engagement bar - YouTube style */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <p className="font-semibold">{article.author}</p>
            <p className="text-sm text-gray-600">
              {article.stats.views.toLocaleString()} views • {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => handleEngage('like')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${liked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <FaThumbsUp /> <span>{article.stats.likes}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaShare /> <span>{article.stats.shares}</span>
            </button>
            <button 
              onClick={() => handleEngage('save')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${saved ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <FaBookmark /> <span>{article.stats.saves}</span>
            </button>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="prose max-w-none mb-8">
          <p className="text-lg font-medium text-gray-700 mb-6">{article.summary}</p>
          <div className="text-gray-800 leading-relaxed space-y-4">
            {article.content.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        {/* Comments Section - YouTube style */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">{article.stats.comments} Comments</h3>
          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* YouTube-style "Up Next" Sidebar */}
      <div className="w-96 p-6 border-l">
        <h3 className="font-semibold mb-4">Up next</h3>
        <div className="space-y-4">
          {related.map(relatedArticle => (
            <NewsCard key={relatedArticle._id} article={relatedArticle} viewMode="list" />
          ))}
        </div>
      </div>
    </div>
  );
}