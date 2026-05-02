const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700/50 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Newstube</h4>
            <p className="text-slate-400 text-sm">AI-Powered news platform bringing you the latest updates</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>World News</li>
              <li>Technology</li>
              <li>Business</li>
              <li>Sports</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 Newstube. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer