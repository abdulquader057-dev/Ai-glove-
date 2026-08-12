import { GitBranch, Hash, Users, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                AI
              </div>
              <span className="text-xl font-bold text-text-primary tracking-tight">Glove</span>
            </a>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Open source hardware project turning hand gestures into spoken words using edge ML. 
              Built for accessibility.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-text-muted hover:text-primary transition-colors" aria-label="GitHub">
                <GitBranch className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-muted hover:text-accent transition-colors" aria-label="Twitter">
                <Hash className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors" aria-label="LinkedIn">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-muted hover:text-[#5865F2] transition-colors" aria-label="Discord">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
              <li><a href="#hardware" className="hover:text-accent transition-colors">Hardware Specs</a></li>
              <li><a href="#pipeline" className="hover:text-accent transition-colors">How it works</a></li>
              <li><a href="#demo" className="hover:text-accent transition-colors">Live Demo</a></li>
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
              <li><a href="https://github.com/abdulquader057-dev/Ai-glove-" className="hover:text-accent transition-colors">GitHub Repo</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Build Guide</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Stay updated</h4>
            <p className="text-sm text-text-secondary mb-4">
              Get notified about new hardware revisions and ML models.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                aria-label="Email address"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} AI Glove Project. Open source under MIT License.
          </p>
          <div className="flex gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
