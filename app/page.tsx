import type { Metadata } from "next";
import { ArticleEnhancements, CitationCopy } from "./client";

export const metadata: Metadata = {
  title: "Building Reliable Long-Horizon Agents",
  description:
    "A field guide to measuring and extending the reliable execution horizon of LLM agents.",
};

const axes = [
  {
    code: "T",
    name: "Human-effort time",
    question: "How long would the work take a qualified human?",
    evidence: "METR · RE-Bench · ALE-Bench",
  },
  {
    code: "I",
    name: "Interaction length",
    question: "How many dependent actions must remain coherent?",
    evidence: "MINT · AgentBoard · UltraHorizon",
  },
  {
    code: "C",
    name: "Context and memory",
    question: "How long must useful state stay correct and retrievable?",
    evidence: "AMA-Bench · AppWorld · OdysseyBench",
  },
  {
    code: "G",
    name: "Environment grounding",
    question: "How tightly must actions track a changing world?",
    evidence: "WebArena · OSWorld · AndroidWorld",
  },
  {
    code: "D",
    name: "Planning dependency",
    question: "How deeply do later choices depend on earlier ones?",
    evidence: "TravelPlanner · Robotouille · SWE-bench",
  },
  {
    code: "O",
    name: "Verification observability",
    question: "How late, sparse, or ambiguous is the correctness signal?",
    evidence: "τ-bench · AppWorld · SWE-bench Verified",
  },
];

const benchmarks = [
  ["Web", "WebArena", "G · I · O", "Goal-state match"],
  ["Web", "VisualWebArena", "G · I", "Goal-state match"],
  ["Computer", "OSWorld", "G · I · C · O", "State / side effects"],
  ["Computer", "AndroidWorld", "G · I · C", "State / side effects"],
  ["Software", "SWE-bench", "D · C · O", "Executable tests"],
  ["Software", "Terminal-Bench", "G · I · O", "Executable tests"],
  ["Tools", "AppWorld", "C · I · O", "State / side effects"],
  ["Tools", "TheAgentCompany", "C · D · G", "Checkpointed progress"],
  ["Planning", "TravelPlanner", "D · C · O", "Constraint checker"],
  ["Planning", "Robotouille", "D · I · O", "Constraint checker"],
];

const evaluationLayers = [
  ["01", "Task success", "Did the final state satisfy the declared objective?"],
  ["02", "Constraint consistency", "Were requirements preserved across the trajectory?"],
  ["03", "Safety and side effects", "What changed beyond the intended task?"],
  ["04", "Progress and recovery", "Where did the system fail, notice, and resume?"],
  ["05", "Cost and latency", "How much inference, tool use, time, and oversight were spent?"],
  ["06", "Uncertainty", "Does the result repeat across trials and stress levels?"],
];

export default function Home() {
  return (
    <>
      <ArticleEnhancements />
      <a className="skip-link" href="#article">
        Skip to article
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Reliable Horizon home">
          <span className="brand-mark" aria-hidden="true">
            RH
          </span>
          <span>Reliable Horizon</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#framework">Framework</a>
          <a href="#benchmarks">Benchmarks</a>
          <a href="#evaluation">Evaluation</a>
          <a className="nav-paper" href="/paper.pdf">
            Paper <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main id="article">
        <article>
          <header className="article-hero" id="top">
            <div className="hero-kicker">
              <span>Survey</span>
              <span>Agent Systems</span>
              <span>July 2026</span>
            </div>
            <h1>Building Reliable Long-Horizon Agents</h1>
            <p className="hero-subtitle">
              Definitions, metrics, benchmarks, and system design for agents
              that must keep acting after the easy part is over.
            </p>
            <div className="hero-meta">
              <p>
                <strong>Kai Wu et al.</strong>
                <span>18 min read</span>
              </p>
              <p className="hero-affiliations">
                Tongji University · Shanghai Jiao Tong University · Nanjing
                University · Zhejiang University · UC Berkeley · Simple Agent Lab
              </p>
            </div>
            <div className="hero-actions" aria-label="Article actions">
              <a className="button primary" href="/paper.pdf">
                Read the paper
              </a>
              <a className="button" href="#benchmarks">
                Explore the evidence
              </a>
            </div>
          </header>

          <div className="article-layout">
            <aside className="outline" aria-label="On this page">
              <p>On this page</p>
              <ol>
                <li>
                  <a href="#horizon">The horizon test</a>
                </li>
                <li>
                  <a href="#framework">A systems property</a>
                </li>
                <li>
                  <a href="#axes">Six pressure axes</a>
                </li>
                <li>
                  <a href="#benchmarks">Benchmark map</a>
                </li>
                <li>
                  <a href="#design">System design</a>
                </li>
                <li>
                  <a href="#evaluation">Evaluation stack</a>
                </li>
                <li>
                  <a href="#agenda">Open problems</a>
                </li>
              </ol>
              <a className="outline-pdf" href="/paper.pdf">
                Download PDF <span aria-hidden="true">↓</span>
              </a>
            </aside>

            <div className="prose">
              <section className="tldr" aria-labelledby="tldr-title">
                <h2 id="tldr-title">In one sentence</h2>
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

                <div className="comparison" role="group" aria-label="Two trajectory types">
                  <div>
                    <span className="comparison-label">Many steps, little horizon</span>
                    <div className="step-line independent" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <p>Independent lookups can be reordered without changing success.</p>
                  </div>
                  <div>
                    <span className="comparison-label">Cross-step coupling</span>
                    <div className="step-line coupled" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <p>Each action changes what the next action can safely mean.</p>
                  </div>
                </div>

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

                <div className="system-stack" role="list" aria-label="Agent system stack">
                  <div role="listitem">
                    <span>Model</span>
                    <p>Local reasoning, planning, action selection, and tool-use quality.</p>
                    <b>decides</b>
                  </div>
                  <div role="listitem">
                    <span>Harness</span>
                    <p>Context, tools, memory, checkpoints, control flow, recovery.</p>
                    <b>sustains</b>
                  </div>
                  <div role="listitem">
                    <span>Environment</span>
                    <p>State transitions, interface semantics, feedback, observability.</p>
                    <b>responds</b>
                  </div>
                  <div role="listitem">
                    <span>Protocol</span>
                    <p>Budgets, retries, graders, trials, safety checks, uncertainty.</p>
                    <b>proves</b>
                  </div>
                </div>

                <p>
                  Small local weaknesses compound when an error enters memory,
                  corrupts external state, invalidates a later precondition, or
                  misleads the verifier. The harness matters because it decides
                  whether those errors are prevented, detected, isolated, or
                  allowed to propagate.
                </p>

                <figure className="wide-figure">
                  <img
                    src="/figures/reliable-horizon-evidence.png"
                    alt="Evidence chain: define task pressure, freeze the stack, repeat trials, test the boundary shift, and report model, harness, environment, and protocol."
                  />
                  <figcaption>
                    What proves a reliable-horizon extension. A single successful
                    run is motivation, not evidence. The system must be held
                    fixed, repeated under a declared stress path, and tested for
                    a robust boundary shift.
                  </figcaption>
                </figure>
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

                <ol className="axis-list">
                  {axes.map((axis) => (
                    <li key={axis.code}>
                      <span className="axis-code">{axis.code}</span>
                      <div>
                        <h3>{axis.name}</h3>
                        <p>{axis.question}</p>
                      </div>
                      <small>{axis.evidence}</small>
                    </li>
                  ))}
                </ol>

                <div className="equation" aria-label="Reliable region equation">
                  <span>Reliable region</span>
                  <code>
                    H<sub>α</sub>(S,Q) = &#123; z : R<sub>S,Q</sub>(z) ≥ α &#125;
                  </code>
                  <p>
                    The set of task pressures <em>z</em> where system <em>S</em>,
                    under protocol <em>Q</em>, succeeds at or above a declared
                    reliability threshold <em>α</em>.
                  </p>
                </div>
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

                <div className="table-wrap" tabIndex={0} role="region" aria-label="Representative benchmark map">
                  <table>
                    <caption>
                      Representative slice of the survey&apos;s 64-entry benchmark inventory
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Domain</th>
                        <th scope="col">Benchmark</th>
                        <th scope="col">Pressure axes</th>
                        <th scope="col">Primary evidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarks.map(([domain, name, pressure, proof]) => (
                        <tr key={name}>
                          <td>{domain}</td>
                          <th scope="row">{name}</th>
                          <td>
                            <code>{pressure}</code>
                          </td>
                          <td>{proof}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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

                <div className="two-column-evidence">
                  <div>
                    <p className="column-kicker">Model design</p>
                    <h3>Make the next action better</h3>
                    <ul>
                      <li>
                        <strong>Reasoning and planning supervision</strong>
                        Decompose goals, maintain subgoals, and revise against feedback.
                      </li>
                      <li>
                        <strong>Tool-use learning</strong>
                        Ground tool selection, arguments, and action semantics.
                      </li>
                      <li>
                        <strong>Long-trajectory reinforcement learning</strong>
                        Learn from delayed rewards and failure-rich rollouts.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="column-kicker">Harness design</p>
                    <h3>Keep one error from becoming many</h3>
                    <ul>
                      <li>
                        <strong>Execution control and feedback</strong>
                        Bound loops, expose environment state, and gate actions.
                      </li>
                      <li>
                        <strong>Context, memory, and persistent state</strong>
                        Preserve invariants, provenance, freshness, and artifacts.
                      </li>
                      <li>
                        <strong>Verification, recovery, and autonomy</strong>
                        Checkpoint, localize faults, roll back, replan, and escalate.
                      </li>
                    </ul>
                  </div>
                </div>

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

                <ol className="evaluation-stack">
                  {evaluationLayers.map(([index, title, description]) => (
                    <li key={index}>
                      <span>{index}</span>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </li>
                  ))}
                </ol>

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

                <div className="agenda-list">
                  <article>
                    <span>A</span>
                    <div>
                      <h3>Model–harness attribution</h3>
                      <p>Hold one layer fixed while varying another, then report cross-combinations.</p>
                    </div>
                  </article>
                  <article>
                    <span>B</span>
                    <div>
                      <h3>Cost-normalized reliability</h3>
                      <p>Compare success jointly with tokens, tools, latency, verification, and human effort.</p>
                    </div>
                  </article>
                  <article>
                    <span>C</span>
                    <div>
                      <h3>Contamination-resistant environments</h3>
                      <p>Rotate tasks, tool schemas, hidden state, and solution traces, not only final questions.</p>
                    </div>
                  </article>
                  <article>
                    <span>D</span>
                    <div>
                      <h3>Adaptive human oversight</h3>
                      <p>Measure when systems ask, when humans intervene, and whether recovery remains reversible.</p>
                    </div>
                  </article>
                </div>

                <p className="closing-statement">
                  Progress is not an agent that runs forever. It is a system
                  whose reliable execution horizon is known, repeatable, and
                  extendable.
                </p>
              </section>

              <section className="paper-block" id="paper">
                <p className="paper-kicker">Continue reading</p>
                <h2>The complete survey</h2>
                <p>
                  The manuscript includes the full benchmark inventory, cited
                  evidence, model and harness taxonomies, evaluation protocols,
                  survey methodology, and bibliography.
                </p>
                <a className="button primary" href="/paper.pdf">
                  Open the PDF
                </a>
                <CitationCopy />
              </section>
            </div>
          </div>
        </article>
      </main>

      <footer className="site-footer">
        <p>
          <strong>Reliable Horizon</strong>
          <span>Building Reliable Long-Horizon Agents: A Survey</span>
        </p>
        <a href="#top">Back to top ↑</a>
      </footer>
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
