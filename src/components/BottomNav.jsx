import { Link, useLocation } from 'react-router-dom'
import { Home, Calendar, BarChart3, Settings, Plus } from 'lucide-react'

export default function BottomNav({ onOpenAddTransaction }) {
  const location = useLocation()

  const tabs = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/budgets', label: 'Budgets', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* FLOATING ACTION BUTTON (+) */}
      <button
        type="button"
        onClick={onOpenAddTransaction}
        title="Add Transaction"
        className="fixed right-6 bottom-20 sm:bottom-8 z-40 w-14 h-14 rounded-full bg-[#6c5ce7] hover:bg-[#5849cf] text-white flex items-center justify-center shadow-xl shadow-[#6c5ce7]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* BOTTOM TAB BAR FOR MOBILE & RESPONSIVE DESKTOP */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#ede9fe] py-2 px-6 flex items-center justify-around sm:hidden shadow-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-[#6c5ce7] font-bold' : 'text-[#94a3b8] hover:text-[#64748b]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px]">{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
