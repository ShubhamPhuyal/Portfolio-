'use client'

const WORKS = [
  { name: 'PROJECT ONE', category: 'PRODUCT DESIGN', mark: '1', markColor: '#f6d6e7' },
  { name: 'PROJECT TWO', category: 'BRAND IDENTITY', mark: '2', markColor: '#315eea' },
  { name: 'PROJECT THREE', category: 'DIGITAL EXPERIENCE', mark: '3', markColor: '#ff6a3d' },
  { name: 'PROJECT FOUR', category: 'PRODUCT DESIGN', mark: '4', markColor: '#6941c6' },
  { name: 'PROJECT FIVE', category: 'BRAND IDENTITY', mark: '5', markColor: '#197b5b' },
  { name: 'PROJECT SIX', category: 'DIGITAL EXPERIENCE', mark: '6', markColor: '#d73d2e' },
]

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    className="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
)

const Works = () => (
  <section
    id="work"
    aria-labelledby="works-heading"
    className="scroll-mt-24 bg-[#f7eee7] px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8"
  >
    <div className="mx-auto w-full max-w-360">
      <h2
        id="works-heading"
        className="mb-8 text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:mb-12 sm:text-6xl"
        style={{ fontFamily: '"Mdnichrometest Dark", Arial, sans-serif' }}
      >
        Featured works
      </h2>

      <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {WORKS.map((work) => (
          <article key={work.name} className="min-w-0">
            <div
              aria-hidden="true"
              className="aspect-square w-full rounded-2xl bg-[#ff5500]"
            />
            <div className="mt-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: work.markColor }}
              >
                {work.mark}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold tracking-[-0.04em] text-[#111111]">
                  {work.name}
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-[#ff5500]">
                  {work.category}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="ml-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ff5500] text-white"
              >
                <ArrowIcon />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)

export default Works