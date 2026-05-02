import PersonalizedFeed from '../components/PersonalizedFeed'

const Feed = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Your Personalized Feed</h1>
        <p className="text-slate-400 mt-2">Content tailored to your interests</p>
      </div>
      <PersonalizedFeed />
    </div>
  )
}

export default Feed