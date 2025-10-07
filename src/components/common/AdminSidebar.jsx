import { Home, MessageSquare, Newspaper, UsersRound } from "lucide-react"
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
      className=" w-64 shrink-0 border-r bg-[#011337] text-brand-white border-brand-navy/40"
      aria-label="Main sidebar"
    >
      {/* Logo area */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div className="leading-tight">
            <div className="text-sm tracking-widest font-semibold">SNS</div>
            <div className="text-sm tracking-widest font-semibold">SQUARE</div>
            <div className="text-xs opacity-80">Redesigning Business</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4">
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
    </aside>
  )
}

function LogoMark() {
  // Simple CSS recreation of the colorful square mark
  return (
    <div className="relative h-10 w-10" aria-hidden="true">
      {/* Outer container */}
      <div className="absolute inset-0 rounded-sm bg-brand-navy" />
      {/* Four colored borders to mimic the reference */}
      <div className="absolute left-0 top-0 h-2 w-6 rounded-sm bg-logo-yellow" />
      <div className="absolute right-0 top-0 h-6 w-2 rounded-sm bg-logo-teal" />
      <div className="absolute right-0 bottom-0 h-2 w-6 rounded-sm bg-logo-pink" />
      <div className="absolute left-0 bottom-0 h-6 w-2 rounded-sm bg-logo-blue" />
      {/* Inner square */}
      <div className="absolute inset-1 bg-brand-navy/60 rounded-sm border border-white/10" />
    </div>
  )
}

export default Sidebar