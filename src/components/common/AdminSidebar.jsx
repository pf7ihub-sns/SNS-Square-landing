import { Home, MessageSquare, Newspaper, UsersRound, Globe } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

// Navigation items data
const items = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/blog", label: "Blogs", icon: MessageSquare },
  { href: "/admin/usecase", label: "UseCases", icon: Newspaper },
  { href: "/admin/career", label: "Job Openings", icon: UsersRound },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside
      className="h-screen w-64 shrink-0 border-r bg-[#011337] text-brand-white border-brand-navy/40 flex flex-col fixed left-0 top-0"
      aria-label="Main sidebar"
    >
      {/* Logo area */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <img
            src="/images/square_logo.png"
            alt="SNS Square Logo"
            className="w-[60px] h-[42px] sm:w-[80px] sm:h-[55px] md:w-[96px] md:h-[66px]"
          />
          {/* <div className="leading-tight">
            <div className="text-sm tracking-widest font-semibold">SNS</div>
            <div className="text-sm tracking-widest font-semibold">SQUARE</div>
            <div className="text-xs opacity-80">Redesigning Business</div>
          </div> */}
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex-1">
        <ul className="flex flex-col">
          {items.map(({ href, label, icon: Icon }) => {
            const isActive = location.pathname === href
            return (
              <li key={href}>
                <Link to={href} className="relative block text-[18px] font-medium">
                  <div
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                      isActive ? "text-white" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {/* Active background gradient bar behind the row */}
                    {isActive && (
                      <span aria-hidden="true" className="sidebar-active absolute inset-y-0 left-0 right-0" />
                    )}

                    {/* Icon */}
                    <Icon size={22} className="relative z-[1] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />

                    {/* Label */}
                    <span className="relative z-[1]">{label}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Back to Website Button */}
      <div className="p-6 border-t border-brand-navy/40">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white transition-colors rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
        >
          <Globe size={20} />
          <span className="font-medium">Back to Website</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar