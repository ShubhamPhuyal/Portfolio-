

import Link from "next/link";

const NavIcon = ({ children }) => (
  <svg
    aria-hidden="true"
    className="size-4 shrink-0 sm:size-4.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full px-3 py-5 sm:px-6">
      <div className="flex justify-center">
        <div className="flex max-w-full items-center gap-2">
        <Link
          href="/"
          aria-label="Home"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#AFAFB1] bg-[#F4F4F5] text-sm font-semibold text-zinc-900 sm:size-14"
        >
          SP
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-0.5 rounded-full border border-[#AFAFB1] bg-[#F4F4F5] p-1 sm:gap-1.5 sm:p-1.5"
        >
          <a href="#work" className="flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-2 text-xs text-zinc-800 transition-colors hover:bg-white/80 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm">
            <NavIcon>
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M3 10h18" />
            </NavIcon>
            Work
          </a>
          <a href="#playground" className="flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-2 text-xs text-zinc-800 transition-colors hover:bg-white/80 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm">
            <NavIcon>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </NavIcon>
            Playground
          </a>
          <a href="#about" className="flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-2 text-xs text-zinc-800 transition-colors hover:bg-white/80 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm">
            <NavIcon>
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <path d="M9 9h.01M15 9h.01" />
            </NavIcon>
            About
          </a>
          <a href="#cv" className="flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-2 text-xs text-zinc-800 transition-colors hover:bg-white/80 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm">
            <NavIcon>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M8 13h8M8 17h8" />
            </NavIcon>
            CV
          </a>
        </nav>
        <a
          href="mailto:"
          aria-label="Email"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-[#AFAFB1] bg-[#ff5500] text-white transition-colors hover:bg-[#e64d00] sm:size-[60px]"
        >
          <NavIcon>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </NavIcon>
        </a>
        </div>
      </div>
    </header>
  )
}

export default Header