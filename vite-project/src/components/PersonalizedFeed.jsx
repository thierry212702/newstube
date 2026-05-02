import { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ArticleCard from './ArticleCard'
import VideoCard from './VideoCard'
import { recommendationAPI } from '../services/api'

const PersonalizedFeed = () => {
  const [items, setItems] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchFeed = async () => {
    try {
      const { data } = await recommendationAPI.getFeed()
      
      if (data.data.length === 0) {
        setHasMore(false)
        return
      }
      
      setItems(prev => [...prev, ...data.data])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Feed error:', error)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchFeed}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
      endMessage={
        <p className="text-center text-slate-500 py-8">
          You've seen all the content for now!
        </p>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          item.contentType === 'video' ? (
            <VideoCard key={item._id} video={item} />
          ) : (
            <ArticleCard key={item._id} article={item} />
          )
        ))}
      </div>
    </InfiniteScroll>
  )
}

export default PersonalizedFeed