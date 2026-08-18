import {
  ArrowUpRightIcon,
  CodeIcon,
  LayersIcon,
  ShuffleIcon,
} from './ui/Icons';

interface HeroProps {
  cardCount: number;
  languageCount: number;
  classificationCount: number;
  onExplore: () => void;
  onRandom: () => void;
}

export function Hero({
  cardCount,
  languageCount,
  classificationCount,
  onExplore,
  onRandom,
}: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="site-container grid min-h-[640px] items-stretch lg:grid-cols-12">
        <div className="flex flex-col justify-center border-border py-20 lg:col-span-7 lg:border-r lg:py-28 lg:pr-14">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-2 w-2 bg-accent shadow-[0_0_18px_rgba(245,182,63,0.75)]" />
            <span className="spec-label text-text-secondary">Interactive DSA field guide</span>
          </div>

          <h1 className="m-0 max-w-[860px] font-display text-[clamp(3.4rem,7vw,7.25rem)] font-semibold uppercase leading-[0.86] tracking-[-0.065em] text-text-primary">
            Think in
            <span className="block text-accent">systems.</span>
            Ship the code.
          </h1>

          <p className="mb-0 mt-8 max-w-[640px] text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            A working codex for algorithms, data structures, and the patterns behind
            technical interviews. Study the concept, inspect the implementation, then
            execute it against a remote runtime.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" className="button-primary" onClick={onExplore}>
              Enter the library
              <ArrowUpRightIcon className="h-4 w-4" />
            </button>
            <button type="button" className="button-secondary" onClick={onRandom}>
              <ShuffleIcon className="h-4 w-4" />
              Random concept
            </button>
          </div>

          <dl className="mt-16 grid max-w-[680px] grid-cols-3 border-y border-border">
            <div className="border-r border-border px-0 py-5 sm:px-4">
              <dt className="spec-label">Concepts</dt>
              <dd className="mb-0 mt-2 font-display text-2xl font-medium text-text-primary sm:text-3xl">
                {String(cardCount).padStart(2, '0')}
              </dd>
            </div>
            <div className="border-r border-border px-4 py-5">
              <dt className="spec-label">Languages</dt>
              <dd className="mb-0 mt-2 font-display text-2xl font-medium text-text-primary sm:text-3xl">
                {String(languageCount).padStart(2, '0')}
              </dd>
            </div>
            <div className="px-4 py-5">
              <dt className="spec-label">Domains</dt>
              <dd className="mb-0 mt-2 font-display text-2xl font-medium text-text-primary sm:text-3xl">
                {String(classificationCount).padStart(2, '0')}
              </dd>
            </div>
          </dl>
        </div>

        <div className="hidden py-14 lg:col-span-5 lg:flex lg:items-center lg:pl-12">
          <div className="panel relative w-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <LayersIcon className="h-4 w-4 text-accent" />
                <span className="spec-label text-text-secondary">Knowledge graph</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-success"
                  style={{ animation: 'status-pulse 2s ease-in-out infinite' }}
                />
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-success">
                  Runtime ready
                </span>
              </div>
            </div>

            <div className="relative aspect-[1.08/1] bg-background/70">
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 520 480"
                fill="none"
              >
                <g stroke="#292e33" strokeWidth="1">
                  <path d="M0 96h520M0 192h520M0 288h520M0 384h520" />
                  <path d="M104 0v480M208 0v480M312 0v480M416 0v480" />
                </g>
                <g stroke="#41484f" strokeWidth="1.25">
                  <path d="m83 342 86-102 102 42 92-137 81 61" />
                  <path d="m169 240 19-117 84 40 91-18" />
                  <path d="m271 282 42 91 131-167" />
                </g>
                <g stroke="#f5b63f" strokeWidth="2">
                  <path d="m83 342 86-102 102 42" />
                  <path d="m271 282 92-137" />
                </g>
                <g fill="#08090a" stroke="#a8adb2" strokeWidth="1.5">
                  <circle cx="83" cy="342" r="10" />
                  <circle cx="169" cy="240" r="10" />
                  <circle cx="188" cy="123" r="10" />
                  <circle cx="271" cy="282" r="10" />
                  <circle cx="272" cy="163" r="10" />
                  <circle cx="313" cy="373" r="10" />
                  <circle cx="363" cy="145" r="10" />
                  <circle cx="444" cy="206" r="10" />
                </g>
                <g fill="#f5b63f">
                  <circle cx="83" cy="342" r="4" />
                  <circle cx="169" cy="240" r="4" />
                  <circle cx="271" cy="282" r="4" />
                  <circle cx="363" cy="145" r="4" />
                </g>
                <g
                  fill="#6f767d"
                  fontFamily="IBM Plex Mono"
                  fontSize="10"
                  letterSpacing="1.2"
                >
                  <text x="57" y="371">INPUT</text>
                  <text x="138" y="222">PATTERN</text>
                  <text x="245" y="310">MODEL</text>
                  <text x="338" y="126">SOLUTION</text>
                  <text x="420" y="232">VERIFY</text>
                </g>
              </svg>

              <div className="absolute bottom-5 left-5 right-5 border border-border bg-surface/90 p-4 backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CodeIcon className="h-4 w-4 text-accent" />
                    <span className="spec-label text-text-secondary">Execution pipeline</span>
                  </div>
                  <span className="font-mono text-[0.625rem] text-text-tertiary">01—04</span>
                </div>
                <div className="grid grid-cols-4 gap-px bg-border">
                  {['Query', 'Model', 'Build', 'Run'].map((step, index) => (
                    <div key={step} className="bg-background px-2 py-3 text-center">
                      <span className="block font-mono text-[0.625rem] text-accent">
                        0{index + 1}
                      </span>
                      <span className="mt-1 block font-mono text-[0.5625rem] uppercase tracking-wider text-text-tertiary">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
