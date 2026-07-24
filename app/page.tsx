import type { Metadata } from "next";
import { ArticleEnhancements, CitationCopy, SitePreferences } from "./client";

export const metadata: Metadata = {
  title: "Building Reliable Long-Horizon Agents: A Survey",
  description:
    "Definitions, metrics, benchmarks, and system design for reliable long-horizon LLM agents.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "zh-CN": "/zh/",
    },
  },
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
        <LocalizedText en="Skip to article" zh="跳至正文" />
      </a>

      <main id="article">
        <article>
          <header className="article-hero" id="top">
            <div className="hero-meta">
              <p className="hero-kicker">
                <LocalizedText
                  en="Survey · July 2026"
                  zh="综述 · 2026 年 7 月"
                />
              </p>
              <SitePreferences />
            </div>
            <h1>Building Reliable Long-Horizon Agents: A Survey</h1>
            <p className="hero-subtitle">
              <LocalizedText
                en="Definitions, Metrics, Benchmarks, and System Design"
                zh="定义、指标、基准与系统设计"
              />
            </p>

            <div className="paper-authorship">
              <p className="author-list" aria-label="Paper authors / 论文作者">
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
                  <sup>*</sup>{" "}
                  <LocalizedText en="Equal contribution" zh="共同贡献" />
                </span>
                <span>
                  <sup>†</sup>{" "}
                  <LocalizedText en="Corresponding author" zh="通讯作者" />
                </span>
              </p>
              <ol
                className="affiliation-list"
                aria-label="Author affiliations / 作者单位"
              >
                {affiliations.map((affiliation, index) => (
                  <li key={affiliation}>
                    <sup>{index + 1}</sup>
                    {affiliation}
                  </li>
                ))}
              </ol>
            </div>

            <div className="hero-actions" aria-label="Paper resources / 论文资源">
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
            <div className="prose">
              <section
                className="tldr"
                id="abstract"
                aria-labelledby="tldr-title"
              >
                <h2 id="tldr-title">
                  <LocalizedText en="Abstract" zh="摘要" />
                </h2>
                <p>
                  <LocalizedText
                    en="Long-horizon capability is not a model property or a context window length. It is the range over which a complete agent system can keep acting while remaining correct, grounded, recoverable, and cost-effective."
                    zh="长时程能力既不是模型自身的属性，也不等同于上下文窗口长度。它描述的是：一个完整的智能体系统能够在多大范围内持续行动，同时保持正确、符合环境事实、可恢复且具有成本效益。"
                  />
                </p>
              </section>

              <p>
                <LocalizedText
                  en="The survey synthesizes 201 research papers and technical sources, 64 benchmark records, six task-pressure axes, and one system-level claim: reliable autonomy emerges from the coupled model, harness, environment, and evaluation protocol."
                  zh="本综述综合了 201 篇研究论文与技术资料、64 项基准记录、六个任务压力维度，并提出一个系统层面的核心观点：可靠自主性源于模型、智能体运行框架、环境与评估协议的协同作用。"
                />
              </p>

              <PaperFigure
                src="/figures/overleaf/figure-1-teaser.webp"
                fullSrc="/figures/overleaf/figure-1-teaser.png"
                alt="Conceptual overview of the research landscape for reliable long-horizon agents, spanning benchmark domains, model design, harness design, and open problems."
                altZh="可靠长时程智能体研究版图的概念总览，涵盖基准领域、模型设计、运行框架设计与开放问题。"
                width={2400}
                height={1350}
                priority
              >
                <LocalizedText
                  en={
                    <>
                      <strong>Figure 1.</strong> Conceptual overview of the
                      research landscape for reliable long-horizon agents,
                      spanning five benchmark domains, model design, harness
                      design, and open problems beyond the current reliable
                      horizon.
                    </>
                  }
                  zh={
                    <>
                      <strong>图 1.</strong>{" "}
                      可靠长时程智能体研究版图的概念总览，涵盖五类基准领域、模型设计、运行框架设计，以及超出当前可靠时程边界的开放问题。
                    </>
                  }
                />
              </PaperFigure>

              <section id="horizon" className="article-section">
                <SectionHeading index="01">
                  <LocalizedText
                    en="What makes a task long-horizon?"
                    zh="什么使一个任务成为长时程任务？"
                  />
                </SectionHeading>
                <p>
                  <LocalizedText
                    en="A task is long-horizon when earlier actions create information, state, constraints, or consequences that later decisions must preserve and verify. Raw duration, context length, turn count, or tool-call count may correlate with this structure, but none defines it."
                    zh="当早期动作产生的信息、状态、约束或后果必须由后续决策保留并验证时，该任务才属于长时程任务。原始时长、上下文长度、轮次数或工具调用次数可能与这种结构相关，但都不能定义它。"
                  />
                </p>

                <PaperFigure
                  src="/figures/overleaf/figure-3-definition-axes.webp"
                  fullSrc="/figures/overleaf/figure-3-definition-axes.png"
                  alt="Conceptual diagram explaining cross-step coupling, the six task-pressure axes, and reliable horizon."
                  altZh="解释跨步骤耦合、六个任务压力维度与可靠时程的概念图。"
                  width={2880}
                  height={1920}
                >
                  <LocalizedText
                    en={
                      <>
                        <strong>Figure 3.</strong> Cross-step coupling
                        distinguishes long-horizon execution from merely long
                        inputs or independent steps. The six axes characterize
                        how task pressure increases; reliability is the response
                        of a fixed system under a fixed protocol.
                      </>
                    }
                    zh={
                      <>
                        <strong>图 3.</strong>{" "}
                        跨步骤耦合将长时程执行与单纯的长输入或彼此独立的步骤区分开来。六个维度刻画任务压力如何增大；可靠性则是在固定系统与固定协议下的响应。
                      </>
                    }
                  />
                </PaperFigure>

                <blockquote>
                  <p>
                    <LocalizedText
                      en="If a trajectory can be reduced to independent one-step predictions without changing its success condition, it is multi-step but not strongly long-horizon."
                      zh="如果在不改变成功条件的前提下，可以将一条轨迹分解为相互独立的单步预测，那么它虽然包含多个步骤，却不具有强长时程性。"
                    />
                  </p>
                </blockquote>

                <p>
                  <LocalizedText
                    en="This definition includes surprisingly short tasks when an early database update, browser action, or code edit changes the feasible future. It excludes long documents and repeated calls that never create meaningful cross-step dependence."
                    zh="这一定义会纳入一些看似很短的任务：只要早期的数据库更新、浏览器操作或代码修改改变了后续的可行空间。相反，长文档和重复调用若从未形成有意义的跨步骤依赖，则不在此列。"
                  />
                </p>

                <p>
                  <LocalizedText
                    en="Once cross-step coupling is present, six task-pressure axes describe how the horizon becomes difficult: human-effort time, interaction length, context and memory demand, environment grounding, planning dependency, and verification observability. A benchmark may stress one axis or several at once."
                    zh="确认存在跨步骤耦合后，六个任务压力维度可以进一步描述长时程难度来自哪里：人工投入时间、交互长度、上下文与记忆需求、环境事实对齐、规划依赖以及验证可观测性。一项基准可能只对一个维度施压，也可能同时覆盖多个维度。"
                  />
                </p>
              </section>

              <section id="framework" className="article-section">
                <SectionHeading index="02">
                  <LocalizedText
                    en="Reliability belongs to the whole system."
                    zh="可靠性属于整个系统。"
                  />
                </SectionHeading>
                <p>
                  <LocalizedText
                    en="The observed horizon is conditioned on four layers. Change any one of them and the measured boundary can move, even when the base model stays fixed."
                    zh="观测到的时程边界取决于四个层面。即使基础模型保持不变，只要改变其中任一层，测得的边界就可能移动。"
                  />
                </p>

                <p>
                  <LocalizedText
                    en="Small local weaknesses compound when an error enters memory, corrupts external state, invalidates a later precondition, or misleads the verifier. The harness matters because it decides whether those errors are prevented, detected, isolated, or allowed to propagate."
                    zh="当错误进入记忆、破坏外部状态、使后续前置条件失效或误导验证器时，局部的小缺陷会不断累积。智能体运行框架之所以重要，是因为它决定这些错误会被预防、检测、隔离，还是继续传播。"
                  />
                </p>

                <p>
                  <LocalizedText
                    en="Model design and harness design are complementary routes to a longer reliable horizon. One improves the quality of each transition. The other controls what survives from one transition to the next."
                    zh="模型设计和运行框架设计是延长可靠时程的两条互补路径：前者提升每次状态转移的质量，后者控制哪些信息与状态会从一次转移延续到下一次。"
                  />
                </p>

                <PaperFigure
                  src="/figures/overleaf/figure-4-model-design.webp"
                  fullSrc="/figures/overleaf/figure-4-model-design.png"
                  alt="Taxonomy of model-design mechanisms for reasoning and planning, tool-use learning, and reinforcement learning in long-horizon agents."
                  altZh="长时程智能体中推理与规划、工具使用学习和强化学习等模型设计机制的分类。"
                  width={1676}
                  height={1043}
                >
                  <LocalizedText
                    en={
                      <>
                        <strong>Figure 4.</strong> Model-design mechanisms for
                        reducing local decision error: reasoning and planning
                        supervision, tool-use learning, and trajectory-level
                        reinforcement learning. The diagram is a conceptual
                        taxonomy, not a quantitative comparison.
                      </>
                    }
                    zh={
                      <>
                        <strong>图 4.</strong>{" "}
                        模型设计通过推理与规划监督、工具使用学习以及轨迹级强化学习来降低局部决策错误。该图给出的是概念分类，而非定量比较。
                      </>
                    }
                  />
                </PaperFigure>

                <p>
                  <LocalizedText
                    en="Harness design then sustains execution through feedback, context selection, persistent state, verification, checkpointing, recovery, and bounded autonomous loops."
                    zh="随后，运行框架通过反馈、上下文选择、持久状态、验证、检查点、恢复与有界自主循环来维持执行。"
                  />
                </p>

                <PaperFigure
                  src="/figures/overleaf/figure-5-evidence-chain.webp"
                  fullSrc="/figures/overleaf/figure-5-evidence-chain.png"
                  alt="Intervention-to-evidence chain showing prevent, detect, recover, and prove mechanisms across model, harness, environment, and evaluation."
                  altZh="展示模型、运行框架、环境与评估中预防、检测、恢复和证明机制的干预证据链。"
                  width={1009}
                  height={476}
                >
                  <LocalizedText
                    en={
                      <>
                        <strong>Figure 5.</strong> Model and harness choices can
                        prevent, detect, or recover from errors, while replayable
                        environments and matched evaluation protocols make those
                        effects attributable. A credible extension claim
                        requires repeated, stratified, matched evaluation with
                        uncertainty.
                      </>
                    }
                    zh={
                      <>
                        <strong>图 5.</strong>{" "}
                        模型与运行框架的设计可以预防、检测错误或从错误中恢复；可重放环境与匹配的评估协议则使这些效果可以归因。要可信地宣称时程边界得到扩展，需要进行重复、分层、匹配且报告不确定性的评估。
                      </>
                    }
                  />
                </PaperFigure>
              </section>

              <section id="evaluation" className="article-section">
                <SectionHeading index="03">
                  <LocalizedText
                    en="How should we evaluate progress?"
                    zh="如何评估真正的进展？"
                  />
                </SectionHeading>
                <p>
                  <LocalizedText
                    en="Long-horizon evaluation spans web navigation, computer use, software engineering, tools and workplace apps, planning, and scientific work. Their scores should not be collapsed into a single leaderboard because their stress paths and proof surfaces differ. The paper appendix contains the complete 64-entry benchmark inventory."
                    zh="长时程评估涵盖网页导航、计算机操作、软件工程、工具与办公应用、规划以及科学研究。由于各类评估的压力路径和验证证据不同，不应将其分数压缩为单一排行榜。论文附录提供了完整的 64 项基准清单。"
                  />
                </p>
                <p>
                  <LocalizedText
                    en="Final success remains essential, but it cannot explain why an agent succeeded, whether it can repeat the result, or what it changed on the way. A useful protocol measures success, consistency, uncertainty, progress, verification, recovery, safety, and efficiency together."
                    zh="最终是否成功仍然至关重要，但它无法解释智能体为何成功、结果能否复现，以及执行过程中改变了什么。有效的评估协议应同时衡量成功率、一致性、不确定性、进展、验证、恢复、安全性与效率。"
                  />
                </p>

                <p>
                  <LocalizedText
                    en="To claim progress, declare a native stress path, freeze the stack and budgets, repeat trials with uncertainty, and test whether the reliable boundary shifts outward. More actions, a larger context window, or one unusually good trace do not establish horizon extension by themselves."
                    zh="要宣称取得进展，应明确原生压力路径，固定系统栈与预算，在报告不确定性的前提下重复试验，并检验可靠边界是否向外移动。更多动作、更大的上下文窗口或一条异常优秀的轨迹，都不足以单独证明时程得到扩展。"
                  />
                </p>
              </section>

              <section id="agenda" className="article-section">
                <SectionHeading index="04">
                  <LocalizedText
                    en="What remains unsolved?"
                    zh="哪些问题仍未解决？"
                  />
                </SectionHeading>
                <p>
                  <LocalizedText
                    en="The next generation of evaluations should make reliability attributable, affordable to reproduce, and meaningful under real use. Four problems are especially urgent."
                    zh="下一代评估应使可靠性可归因、复现成本可承受，并能反映真实使用场景。其中有四个问题尤为紧迫。"
                  />
                </p>

                <PaperFigure
                  src="/figures/overleaf/figure-6-open-problems.webp"
                  fullSrc="/figures/overleaf/figure-6-open-problems.png"
                  alt="Overview of failure modes and open problems in reliable long-horizon execution."
                  altZh="可靠长时程执行中的失效模式与开放问题概览。"
                  width={2880}
                  height={1606}
                >
                  <LocalizedText
                    en={
                      <>
                        <strong>Figure 6.</strong> Planning, grounding, and tool
                        failures; memory failure and goal drift; error
                        propagation and recovery; and evaluation validity, cost,
                        and human oversight.
                      </>
                    }
                    zh={
                      <>
                        <strong>图 6.</strong>{" "}
                        规划、环境对齐与工具使用失败；记忆失效与目标漂移；错误传播与恢复；以及评估有效性、成本和人工监督。
                      </>
                    }
                  />
                </PaperFigure>
              </section>

              <section className="paper-block" id="citation">
                <p className="paper-kicker">
                  <LocalizedText en="Citation" zh="引用" />
                </p>
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

function LocalizedText({
  en,
  zh,
}: {
  en: React.ReactNode;
  zh: React.ReactNode;
}) {
  return (
    <>
      <span className="lang-en" lang="en">
        {en}
      </span>
      <span className="lang-zh" lang="zh-CN">
        {zh}
      </span>
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
        <span className="resource-status">
          <LocalizedText en="soon" zh="即将开放" />
        </span>
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
  altZh,
  width,
  height,
  children,
  priority = false,
}: {
  src: string;
  fullSrc?: string;
  alt: string;
  altZh: string;
  width: number;
  height: number;
  children: React.ReactNode;
  priority?: boolean;
}) {
  return (
    <figure className="wide-figure paper-source">
      <a href={fullSrc ?? src} target="_blank" rel="noreferrer">
        <img
          src={src}
          alt={alt}
          data-alt-en={alt}
          data-alt-zh={altZh}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          data-paper-asset
        />
      </a>
      <figcaption>{children}</figcaption>
    </figure>
  );
}
