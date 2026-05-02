import { FiTrendingUp } from 'react-icons/fi'

const TrendingTopics = ({ topics }) => {
  const defaultTopics = [
    { name: 'Artificial Intelligence', count: '12.5K', trending: true },
    { name: 'Climate Change', count: '8.3K', trending: true },
    { name: 'Global Economy', count: '6.7K', trending: false },
    { name: 'Space Exploration', count: '5.2K', trending: true },
    { name: 'Healthcare Innovation', count: '4.8K', trending: false },
    { name: 'Digital Privacy', count: '3.9K', trending: true },
  ]

  const displayTopics = topics || defaultTopics

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
      <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
        <FiTrendingUp className="text-brand-400" />
        Trending Topics
      </h3>
      <div className="space-y-3">
        {displayTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm font-medium">{topic.name}</p>
              <p className="text-slate-500 text-xs">{topic.count} discussions</p>
            </div>
            {topic.trending && (
              <span className="text-green-400 text-xs">↑ Trending</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendingTopics