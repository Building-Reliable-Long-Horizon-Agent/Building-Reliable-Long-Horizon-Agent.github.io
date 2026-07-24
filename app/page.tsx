import type { Metadata } from "next";
import { ArticleEnhancements, CitationCopy } from "./client";

export const metadata: Metadata = {
  title: "Building Reliable Long-Horizon Agents: A Survey",
  description:
    "Definitions, metrics, benchmarks, and system design for reliable long-horizon LLM agents.",
};

const authors = [
  { name: "Kai Wu", mark: "1,*" },
  { name: "Hao Lyu", mark: "1,*" },
  { name: "Zhen Luo", mark: "1,*" },
  { name: "Chaofan Wang", mark: "2" },
  { name: "Siyu Ye", mark: "6" },
  { name: "Jinghao Lin", mark: "6" },
  { name: "Xiaozhong Ji", mark: "3" },
  { name: "Boyuan Jiang", mark: "4" },
  { name: "Yiwen Ye", mark: "6" },
  { name: "Zimu Wang", mark: "5" },
  { name: "Wenzhe Liu", mark: "6" },
  { name: "Ruobing Wang", mark: "6" },
  { name: "Kai Cai", mark: "6" },
  { name: "Shengzhi Wang", mark: "1" },
  { name: "Qingwen Liu", mark: "1,†" },
];

const affiliations = [
  "Tongji University",
  "Shanghai Jiao Tong University",
  "Nanjing University",
  "Zhejiang University",
  "University of California, Berkeley",
  "Simple Agent Lab",
];

const projectLinks = {
  github:
    "https://github.com/Building-Reliable-Long-Horizon-Agent/Building-Reliable-Long-Horizon-Agent.github.io",
  arxiv: undefined,
  openReview: undefined,
} as const;

export default function Home() {
  return (
    <>
      <ArticleEnhancements />
      <a className="skip-link" href="#article">
        Skip to article
      </a>

      <main id="article">
        <article>
          <header className="article-hero" id="top">
            <p className="hero-kicker">Survey · July 2026</p>
            <h1>Building Reliable Long-Horizon Agents: A Survey</h1>
            <p className="hero-subtitle">
              Definitions, Metrics, Benchmarks, and System Design
            </p>

            <div className="paper-authorship">
              <p className="author-list" aria-label="Paper authors">
                {authors.map((author, index) => (
                  <span className="author" key={author.name}>
                    {author.name}
                    <sup>{author.mark}</sup>
                    {index < authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="author-notes">
                <span>
                  <sup>*</sup> Equal contribution
                </span>
                <span>
                  <sup>†</sup> Corresponding author
                </span>
              </p>
              <ol className="affiliation-list" aria-label="Author affiliations">
                {affiliations.map((affiliation, index) => (
                  <li key={affiliation}>
                    <sup>{index + 1}</sup>
                    {affiliation}
                  </li>
                ))}
              </ol>
            </div>

            <div className="hero-actions" aria-label="Article actions">
              <a className="button primary" href="/paper.pdf">
                PDF
              </a>
              <ResourceLink
                label="GitHub"
                href={projectLinks.github}
                icon="github"
              />
              <ResourceLink
                label="arXiv"
                href={projectLinks.arxiv}
                icon="arxiv"
              />
              <ResourceLink
                label="OpenReview"
                href={projectLinks.openReview}
              />
            </div>
          </header>

          <div className="article-shell">
            <details className="article-toc" open>
              <summary>Table of contents</summary>
              <ol>
                <li>
                  <a href="#horizon">Long-horizon definition</a>
                </li>
                <li>
                  <a href="#framework">System framework</a>
                </li>
                <li>
                  <a href="#axes">Six task-pressure axes</a>
                </li>
                <li>
                  <a href="#benchmarks">Benchmark landscape</a>
                </li>
                <li>
                  <a href="#design">Model and harness design</a>
                </li>
                <li>
                  <a href="#evaluation">Evaluation protocol</a>
                </li>
                <li>
                  <a href="#agenda">Open problems</a>
                </li>
                <li>
                  <a href="#citation">Citation</a>
                </li>
              </ol>
            </details>

            <div className="prose">
              <section
                className="tldr"
                id="abstract"
                aria-labelledby="tldr-title"
              >
                <h2 id="tldr-title">Abstract, in one sentence</h2>
                <p>
                  Long-horizon capability is not a model property or a context
                  window length. It is the range over which a complete agent
                  system can keep acting while remaining correct, grounded,
                  recoverable, and cost-effective.
                </p>
              </section>

              <p className="lede">
                LLM agents are moving from isolated answers to long-running,
                stateful work across codebases, websites, computer interfaces,
                databases, and scientific workflows. That shift changes the
                central question. It is no longer only <em>can the model solve
                this?</em> It is <em>how far can the system proceed before
                accumulated state becomes unreliable?</em>
              </p>

              <p>
                The survey synthesizes 201 research papers and technical
                sources, 64 benchmark records, six task-pressure axes, and one
                system-level claim: reliable autonomy emerges from the coupled
                model, harness, environment, and evaluation protocol.
              </p>

              <PaperFigure
                src="/figures/overleaf/figure-1-teaser.webp"
                fullSrc="/figures/overleaf/figure-1-teaser.png"
                alt="Conceptual overview of the research landscape for reliable long-horizon agents, spanning benchmark domains, model design, harness design, and open problems."
                width={2400}
                height={1350}
                priority
              >
                <strong>Figure 1.</strong> Conceptual overview of the research
                landscape for reliable long-horizon agents, spanning five
                benchmark domains, model design, harness design, and open
                problems beyond the current reliable horizon.
              </PaperFigure>

              <section id="horizon" className="article-section">
                <SectionHeading index="01">
                  Length is a weak proxy. Dependency is the test.
                </SectionHeading>
                <p>
                  A task is long-horizon when earlier actions create information,
                  state, constraints, or consequences that later decisions must
                  preserve and verify. Raw duration, context length, turn count,
                  or tool-call count may correlate with this structure, but none
                  defines it.
                </p>

                <PaperFigure
                  src="/figures/overleaf/figure-3-definition-axes.webp"
                  fullSrc="/figures/overleaf/figure-3-definition-axes.png"
                  alt="Conceptual diagram explaining cross-step coupling, the six task-pressure axes, and reliable horizon."
                  width={2880}
                  height={1920}
                >
                  <strong>Figure 3.</strong> Cross-step coupling distinguishes
                  long-horizon execution from merely long inputs or independent
                  steps. The six axes characterize how task pressure increases;
                  reliability is the response of a fixed system under a fixed
                  protocol.
                </PaperFigure>

                <blockquote>
                  <p>
                    If a trajectory can be reduced to independent one-step
                    predictions without changing its success condition, it is
                    multi-step but not strongly long-horizon.
                  </p>
                </blockquote>

                <p>
                  This definition includes surprisingly short tasks when an
                  early database update, browser action, or code edit changes the
                  feasible future. It excludes long documents and repeated calls
                  that never create meaningful cross-step dependence.
                </p>
              </section>

              <section id="framework" className="article-section">
                <SectionHeading index="02">
                  The reliable horizon belongs to the whole system.
                </SectionHeading>
                <p>
                  The observed horizon is conditioned on four layers. Change any
                  one of them and the measured boundary can move, even when the
                  base model stays fixed.
                </p>

                <p>
                  Small local weaknesses compound when an error enters memory,
                  corrupts external state, invalidates a later precondition, or
                  misleads the verifier. The harness matters because it decides
                  whether those errors are prevented, detected, isolated, or
                  allowed to propagate.
                </p>

                <PaperFigure
                  src="/figures/overleaf/figure-5-evidence-chain.webp"
                  fullSrc="/figures/overleaf/figure-5-evidence-chain.png"
                  alt="Intervention-to-evidence chain showing prevent, detect, recover, and prove mechanisms across model, harness, environment, and evaluation."
                  width={1009}
                  height={476}
                >
                  <strong>Figure 5.</strong> Model and harness choices can
                  prevent, detect, or recover from errors, while replayable
                  environments and matched evaluation protocols make those
                  effects attributable. A credible extension claim requires
                  repeated, stratified, matched evaluation with uncertainty.
                </PaperFigure>

                <PaperFigure
                  src="/figures/overleaf/figure-2-survey-map.webp"
                  fullSrc="/figures/overleaf/figure-2-survey-map.png"
                  alt="Survey map linking each section to its long-horizon themes and representative evidence."
                  width={2016}
                  height={1628}
                  compact
                >
                  <strong>Figure 2.</strong> Survey map linking each section to
                  its long-horizon themes and representative evidence. Branches
                  organize the literature; years identify source records rather
                  than comparable performance values.
                </PaperFigure>
              </section>

              <section id="axes" className="article-section">
                <SectionHeading index="03">
                  Horizon is a coordinate system, not one number.
                </SectionHeading>
                <p>
                  Cross-step coupling tells us whether an execution is
                  long-horizon. Six task-pressure axes tell us how. A benchmark
                  may stress one axis or several at once.
                </p>

                <PaperFigure
                  src="/figures/overleaf/table-1-six-axes.svg"
                  alt="Table 1: Six long-horizon axes, their task pressures, and the corresponding reliability questions."
                  width={465}
                  height={201}
                  table
                >
                  <strong>Table 1.</strong> Six long-horizon axes and their
                  reliability interpretation, exported from the latest compiled
                  manuscript.
                </PaperFigure>
              </section>

              <section id="benchmarks" className="article-section">
                <SectionHeading index="04">
                  Benchmarks measure different kinds of distance.
                </SectionHeading>
                <p>
                  Long-horizon evaluation spans web navigation, computer use,
                  software engineering, tools and workplace apps, planning, and
                  scientific work. Their scores should not be collapsed into a
                  single leaderboard because their stress paths and proof
                  surfaces differ.
                </p>

                <PaperFigure
                  src="/figures/overleaf/table-2-benchmarks.svg"
                  alt="Table 2: Representative long-horizon agent benchmarks with domain, scale, typed per-task extent, coupling, persistent state, and correctness signal."
                  width={459}
                  height={576}
                  table
                >
                  <strong>Table 2.</strong> Representative long-horizon agent
                  benchmarks and concrete horizon evidence. The complete
                  64-entry benchmark inventory appears in the paper appendix.
                </PaperFigure>

                <p className="note">
                  <strong>Read the score with the protocol.</strong> A result is
                  only interpretable alongside the model, harness, retry budget,
                  tools, grader, environment version, and number of trials.
                </p>
              </section>

              <section id="design" className="article-section">
                <SectionHeading index="05">
                  Models reduce local error. Harnesses stop it from becoming history.
                </SectionHeading>
                <p>
                  Model design and harness design are complementary routes to a
                  longer reliable horizon. One improves the quality of each
                  transition. The other controls what survives from one
                  transition to the next.
                </p>

                <PaperFigure
                  src="/figures/overleaf/figure-4-model-design.webp"
                  fullSrc="/figures/overleaf/figure-4-model-design.png"
                  alt="Taxonomy of model-design mechanisms for reasoning and planning, tool-use learning, and reinforcement learning in long-horizon agents."
                  width={1676}
                  height={1043}
                >
                  <strong>Figure 4.</strong> Model-design mechanisms for reducing
                  local decision error: reasoning and planning supervision,
                  tool-use learning, and trajectory-level reinforcement learning.
                  The diagram is a conceptual taxonomy, not a quantitative
                  comparison.
                </PaperFigure>

                <p>
                  Harness design then sustains execution through feedback,
                  context selection, persistent state, verification,
                  checkpointing, recovery, and bounded autonomous loops.
                </p>

                <blockquote className="signal-quote">
                  <p>
                    The same model reaches different horizons depending on the
                    feedback that catches its errors, the state it can carry, and
                    the verification that lets it run unattended.
                  </p>
                </blockquote>
              </section>

              <section id="evaluation" className="article-section">
                <SectionHeading index="06">
                  Evaluate the trajectory, not only the destination.
                </SectionHeading>
                <p>
                  Final success remains essential, but it cannot explain why an
                  agent succeeded, whether it can repeat the result, or what it
                  changed on the way. A useful protocol measures outcomes as a
                  stack.
                </p>

                <PaperFigure
                  src="/figures/overleaf/table-3-metric-stack.svg"
                  alt="Table 3: Metric stack for reliable long-horizon agent evaluation, including outcome, repeated attempts, reliability, uncertainty, reliable boundary, progress, trajectory, verification, recovery, safety, and efficiency."
                  width={465}
                  height={540}
                  table
                >
                  <strong>Table 3.</strong> Metric stack for reliable
                  long-horizon agent evaluation, exported from the latest
                  compiled manuscript.
                </PaperFigure>

                <p>
                  To claim progress, declare a native stress path, freeze the
                  stack and budgets, repeat trials with uncertainty, and test
                  whether the reliable boundary shifts outward. More actions, a
                  larger context window, or one unusually good trace do not
                  establish horizon extension by themselves.
                </p>
              </section>

              <section id="agenda" className="article-section">
                <SectionHeading index="07">
                  The open problem is trustworthy delegation.
                </SectionHeading>
                <p>
                  The next generation of evaluations should make reliability
                  attributable, affordable to reproduce, and meaningful under
                  real use. Four problems are especially urgent.
                </p>

                <PaperFigure
                  src="/figures/overleaf/figure-6-open-problems.webp"
                  fullSrc="/figures/overleaf/figure-6-open-problems.png"
                  alt="Overview of failure modes and open problems in reliable long-horizon execution."
                  width={2880}
                  height={1606}
                >
                  <strong>Figure 6.</strong> Planning, grounding, and tool
                  failures; memory failure and goal drift; error propagation and
                  recovery; and evaluation validity, cost, and human oversight.
                </PaperFigure>

                <ul className="plain-agenda">
                  <li>
                    <strong>Model–harness attribution.</strong> Hold one layer
                    fixed while varying another, then report cross-combinations.
                  </li>
                  <li>
                    <strong>Cost-normalized reliability.</strong> Compare
                    success jointly with tokens, tools, latency, verification,
                    and human effort.
                  </li>
                  <li>
                    <strong>Contamination-resistant environments.</strong>
                    Rotate tasks, tool schemas, hidden state, and solution
                    traces, not only final questions.
                  </li>
                  <li>
                    <strong>Adaptive human oversight.</strong> Measure when
                    systems ask, when humans intervene, and whether recovery
                    remains reversible.
                  </li>
                </ul>

                <p className="closing-statement">
                  Progress is not an agent that runs forever. It is a system
                  whose reliable execution horizon is known, repeatable, and
                  extendable.
                </p>
              </section>

              <section className="paper-block" id="citation">
                <p className="paper-kicker">Citation</p>
                <p>
                  {authors.map((author) => author.name).join(", ")}. “Building
                  Reliable Long-Horizon Agents: A Survey.” Preprint, 2026.
                </p>
                <CitationCopy />
              </section>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

function SectionHeading({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <span>{index}</span>
      <h2>{children}</h2>
    </div>
  );
}

function ResourceLink({
  label,
  href,
  icon,
}: {
  label: string;
  href?: string;
  icon?: "github" | "arxiv";
}) {
  const iconElement = icon ? (
    <img
      className="resource-icon"
      src={`/icons/${icon}.svg`}
      alt=""
      width={15}
      height={15}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  ) : null;

  if (!href) {
    return (
      <span className="button unavailable" aria-disabled="true">
        {iconElement}
        {label}
        <span className="resource-status">soon</span>
      </span>
    );
  }

  return (
    <a className="button" href={href} target="_blank" rel="noreferrer">
      {iconElement}
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

function PaperFigure({
  src,
  fullSrc,
  alt,
  width,
  height,
  children,
  compact = false,
  table = false,
  priority = false,
}: {
  src: string;
  fullSrc?: string;
  alt: string;
  width: number;
  height: number;
  children: React.ReactNode;
  compact?: boolean;
  table?: boolean;
  priority?: boolean;
}) {
  const classes = [
    "wide-figure",
    "paper-source",
    compact ? "paper-source-compact" : "",
    table ? "paper-source-table" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={classes}>
      <a href={fullSrc ?? src} target="_blank" rel="noreferrer">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          data-paper-asset
        />
      </a>
      <figcaption>
        {children}
        <span>Open full resolution ↗</span>
      </figcaption>
    </figure>
  );
}
