import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="text-center sm:text-left">© 2025 Dandi GitHub Analyzer. All rights reserved.</span>
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export default Footer
