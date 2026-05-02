import { FiPlay, FiEye } from 'react-icons/fi'

const VideoCard = ({ video, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-brand-500/50 transition-all hover:shadow-lg"
    >
      <div className="relative aspect-video bg-slate-700 overflow-hidden">
        <img
          src={video.thumbnailUrl || 'https://picsum.photos/640/360'}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-brand-600/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiPlay className="text-white text-xl ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
          {video.duration}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-2 group-hover:text-brand-400 transition-colors">
              {video.title}
            </h3>
            <p className="text-slate-400 text-xs mb-2">{video.channel}</p>
            <div className="flex items-center gap-3 text-slate-500 text-xs">
              <span className="flex items-center gap-1">
                <FiEye className="text-xs" /> {video.views?.toLocaleString() || 0} views
              </span>
              <span>{video.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard