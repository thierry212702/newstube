import { FiClock, FiUser, FiHeart, FiShare2, FiBookmark } from 'react-icons/fi'

const ArticleCard = ({ article, onClick }) => {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-brand-500/50 transition-all hover:shadow-lg"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
          <img
            src={article.imageUrl || `https://picsum.photos/seed/${article._id}/400/300`}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-brand-500/20 text-brand-400 rounded text-xs font-medium">
              {article.category}
            </span>
            {article.isBreaking && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium animate-pulse">
                BREAKING
              </span>
            )}
            {article.isTrending && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                TRENDING
              </span>
            )}
          </div>
          
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-brand-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
            {article.summary || article.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-slate-500 text-xs">
              <span className="flex items-center gap-1">
                <FiUser /> {article.author || 'Staff Writer'}
              </span>
              <span className="flex items-center gap-1">
                <FiClock /> {article.readTime || 5} min read
              </span>
              <span>{article.source}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                <FiHeart className="text-sm" />
              </button>
              <button className="p-1.5 text-slate-500 hover:text-brand-400 transition-colors">
                <FiBookmark className="text-sm" />
              </button>
              <button className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors">
                <FiShare2 className="text-sm" />
              </button>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
                style={{ width: `${Math.min((article.engagement / 10000) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{article.engagement?.toLocaleString()} engagement</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard