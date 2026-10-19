'use client'

import TalkButton from './TalkButton'

const PLANS = [
  {
    name: 'JUST KRUMBLING',
    description: 'Get a taste of Krackerz',
    price: 'FREE',
    features: [
      'Access to first module for 14 days',
      'Discover and join events',
      'Benchmark yourself',
    ],
  },
  {
    name: 'READY TO KRACK',
    description: 'For designers ready to krack further',
    price: '$350',
    period: 'YEAR',
    savings: 'Save $70',
    featured: true,
    features: [
      'Full access to all courses',
      'Discover and join events',
      'Benchmark yourself',
      'Connect with communities',
      'Mentor from industry experts*',
    ],
  },
  {
    name: 'STUDENTS',
    description: "Get krackin' early in your career",
    price: '$160',
    period: 'YEAR',
    savings: 'Save $32',
    features: [
      'Full access to all courses',
      'Discover and join events',
      'Connect with communities',
    ],
  },
]

const FeatureIcon = () => (
  <svg
    aria-hidden="true"
    className="size-6 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 2 2.1 1.8 2.8-.3 1 2.6 2.6 1-.3 2.8L22 12l-1.8 2.1.3 2.8-2.6 1-1 2.6-2.8-.3L12 22l-2.1-1.8-2.8.3-1-2.6-2.6-1 .3-2.8L2 12l1.8-2.1-.3-2.8 2.6-1 1-2.6 2.8.3L12 2Z" />
    <path d="m8.8 12 2.1 2.1 4.4-4.4" />
  </svg>
)

const Pricing = () => (
  <section
    id="pricing"
    aria-labelledby="pricing-heading"
    className="bg-[#f7eee7] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
  >
    <div className="mx-auto w-full max-w-7xl">
      <h2
        id="pricing-heading"
        className="mb-10 text-center text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:mb-14 sm:text-6xl"
        style={{
          fontFamily: '"Mdnichrometest Dark", Arial, sans-serif',
        }}
      >
        Pricing
      </h2>

      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-7">
        {PLANS.map((plan) => {
          const cardContent = (
            <div
              className={`relative flex min-w-0 flex-col overflow-hidden ${
                plan.featured
                  ? 'rounded-2xl bg-[#ff5500] px-5 py-7 text-white sm:px-6 sm:py-8'
                  : 'rounded-2xl border border-[#e7d7d0] bg-white px-5 py-5 text-[#171717] sm:px-6 sm:py-6'
              }`}
            >
              {plan.savings && (
                <span
                  className={`absolute right-5 top-5 rounded-full border px-3 py-1 text-xs font-semibold leading-none sm:right-6 sm:top-6 ${
                    plan.featured
                      ? 'border-white/70 bg-[#650d12] text-white'
                      : 'border-black/20 bg-[#ff3b16] text-white shadow-sm'
                  }`}
                >
                  {plan.savings}
                </span>
              )}

              <div className={plan.savings ? 'pr-20' : ''}>
                <h3 className="text-sm font-bold tracking-[-0.02em] sm:text-base">
                  {plan.name}
                </h3>

                <p
                  className={`mt-1 whitespace-nowrap text-sm leading-snug ${
                    plan.featured
                      ? 'text-white/90'
                      : 'text-[#5c5c5c]'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <p
                className={`mt-3 whitespace-nowrap text-[40px] leading-10 font-black sm:text-[48px] sm:leading-[48px] ${
                  plan.featured ? 'text-white' : 'text-[#171717]'
                }`}
                style={{
                  fontFamily:
                    '"Highway Motel Sans Regular", "Highway Motel Sans Regular Placeholder", sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                }}
              >
                {plan.price}

                {plan.period && (
                  <span className="ml-2 text-[0.48em] leading-none tracking-normal">
                    / {plan.period}
                  </span>
                )}
              </p>

              <TalkButton
                label="Join Waitlist"
                href="mailto:"
                buttonClassName={`group relative isolate mt-6 inline-flex h-12 w-full items-center justify-between gap-3 overflow-hidden rounded-full border-2 border-[#171717] py-1 pl-4 pr-1 text-sm font-bold uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5500] sm:mt-7 ${
                  plan.featured
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#f7f6f1] text-[#171717]'
                }`}
                fillClassName={
                  plan.featured
                    ? 'rounded-full bg-white'
                    : 'rounded-full bg-[#ff5500]'
                }
                labelClassName={`font-bold ${
                  plan.featured
                    ? 'text-white group-hover:!text-[#171717]'
                    : 'text-[#171717] group-hover:!text-[#171717]'
                }`}
                arrowClassName="size-8 shrink-0 !bg-white !text-[#171717]"
              />

              <ul className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-center gap-3 text-sm leading-snug sm:text-base ${
                      plan.featured
                        ? 'text-white/95'
                        : 'text-[#555555]'
                    }`}
                  >
                    <span
                      className={
                        plan.featured
                          ? 'text-white/90'
                          : 'text-[#650d12]'
                      }
                    >
                      <FeatureIcon />
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )

          return plan.featured ? (
            <article
              key={plan.name}
              className="pricing-featured-shell relative z-10 min-w-0 overflow-hidden"
              style={{
                clipPath: 'inset(0 0 0 0 round 16px)',
              }}
            >
              {cardContent}
            </article>
          ) : (
            <article key={plan.name} className="min-w-0">
              {cardContent}
            </article>
          )
        })}
      </div>
    </div>
  </section>
)

export default Pricing