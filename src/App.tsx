import { useEffect, useRef, useState } from "react";

const resumePdf = "/Abrar_Bari_Resume.pdf";
const portraitImage = "/portrait.jpg";

const levels = [
  { id: "level-1", number: "01", label: "About" },
  { id: "level-2", number: "02", label: "Experience" },
  { id: "level-3", number: "03", label: "Projects" },
  { id: "level-4", number: "04", label: "Skills" },
  { id: "level-5", number: "05", label: "Future Goals" },
];

const accentRgb = "106,228,235";
const githubUsername = "abbari6566";
const contributionsRefreshMs = 60 * 60 * 1000;

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

interface CalendarDay extends ContributionDay {
  isPadding: boolean;
}

const githubPath =
  "M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1.8 1.6 2.7 1.2.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z";

const linkedinPath =
  "M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V8h3v11zM6.5 6.7a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zM19 19h-3v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V19h-3V8h2.9v1.5h.04A3.2 3.2 0 0 1 14.5 7.8c3 0 3.5 2 3.5 4.6V19z";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d={githubPath} />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d={linkedinPath} />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M14 7l-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    </svg>
  );
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftDate(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function buildContributionWeeks(contributions: ContributionDay[]) {
  if (contributions.length === 0) return [];

  const sorted = [...contributions].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const byDate = new Map(sorted.map((day) => [day.date, day]));
  const firstDate = new Date(`${sorted[0].date}T00:00:00Z`);
  const lastDate = new Date(`${sorted[sorted.length - 1].date}T00:00:00Z`);
  const start = shiftDate(firstDate, -firstDate.getUTCDay());
  const end = shiftDate(lastDate, 6 - lastDate.getUTCDay());
  const weeks: CalendarDay[][] = [];

  for (let cursor = start; cursor <= end; cursor = shiftDate(cursor, 7)) {
    const week = Array.from({ length: 7 }, (_, dayIndex) => {
      const current = shiftDate(cursor, dayIndex);
      const key = dateKey(current);
      const contribution = byDate.get(key);
      return {
        date: key,
        count: contribution?.count ?? 0,
        level: contribution?.level ?? 0,
        isPadding: !contribution,
      };
    });

    weeks.push(week);
  }

  return weeks.slice(-53);
}

function getMonthLabels(weeks: CalendarDay[][]) {
  let previousMonth = -1;

  return weeks.map((week) => {
    const firstRealDay = week.find((day) => !day.isPadding);
    if (!firstRealDay) return "";

    const date = new Date(`${firstRealDay.date}T00:00:00Z`);
    const month = date.getUTCMonth();
    if (month === previousMonth) return "";

    previousMonth = month;
    return date.toLocaleString("en", { month: "short", timeZone: "UTC" });
  });
}

function formatContributionDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getContributionsUrl(year: number) {
  const currentYear = new Date().getFullYear();
  const range = year === currentYear ? "last" : String(year);
  return `https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=${range}`;
}

function useMissionConsole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railLineRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(() => {
    try {
      return sessionStorage.getItem("ab_entered") === "1";
    } catch {
      return false;
    }
  });
  const [progress, setProgress] = useState(0);
  const [railHeight, setRailHeight] = useState(0);
  const [active, setActive] = useState(levels[0].id);
  const [visited, setVisited] = useState<Set<string>>(
    () => new Set([levels[0].id]),
  );

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (entered) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setEntered(true);
        try {
          sessionStorage.setItem("ab_entered", "1");
        } catch {
          // Session storage can be unavailable in restricted browser contexts.
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered]);

  useEffect(() => {
    const updateRail = () => {
      const html = document.documentElement;
      const max = html.scrollHeight - html.clientHeight;
      const pct = max > 0 ? html.scrollTop / max : 0;
      const activationLine = window.scrollY + window.innerHeight * 0.42;
      const activeIndex = levels.reduce((currentIndex, level, index) => {
        const section = document.getElementById(level.id);
        return section && section.offsetTop <= activationLine
          ? index
          : currentIndex;
      }, 0);
      const railProgress = activeIndex / Math.max(levels.length - 1, 1);

      setProgress(pct);
      setRailHeight((railLineRef.current?.offsetHeight ?? 0) * railProgress);
      setActive(levels[activeIndex].id);
      setVisited((prev) => {
        const next = new Set(prev);
        levels.slice(0, activeIndex + 1).forEach((level) => next.add(level.id));
        return next;
      });
    };

    updateRail();
    window.addEventListener("scroll", updateRail, { passive: true });
    window.addEventListener("resize", updateRail);
    return () => {
      window.removeEventListener("scroll", updateRail);
      window.removeEventListener("resize", updateRail);
    };
  }, []);

  useEffect(() => {
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal"),
    );

    const revealInView = () => {
      const vh = window.innerHeight;
      reveals.forEach((el) => {
        if (el.classList.contains("in")) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.92 && rect.bottom > 0) el.classList.add("in");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    reveals.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", revealInView, { passive: true });
    window.addEventListener("resize", revealInView);
    const firstTimer = window.setTimeout(revealInView, 600);
    const secondTimer = window.setTimeout(revealInView, 1600);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealInView);
      window.removeEventListener("resize", revealInView);
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frameId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dots: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }> = [];

    const resize = () => {
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      dots.length = 0;
      const count = Math.min(
        80,
        Math.floor((window.innerWidth * window.innerHeight) / 16000),
      );
      for (let i = 0; i < count; i += 1) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18 * dpr,
          vy: (Math.random() - 0.5) * 0.18 * dpr,
          r: (Math.random() * 1.4 + 0.5) * dpr,
        });
      }
    };

    const render = () => {
      if (document.hidden) {
        context.clearRect(0, 0, width, height);
        return;
      }

      context.clearRect(0, 0, width, height);
      const rgb =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--teal-rgb")
          .trim() || accentRgb;
      const link = 130 * dpr;

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        for (let j = i + 1; j < dots.length; j += 1) {
          const other = dots[j];
          const dx = dot.x - other.x;
          const dy = dot.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < link) {
            context.strokeStyle = `rgba(${rgb},${0.12 * (1 - distance / link)})`;
            context.lineWidth = dpr * 0.6;
            context.beginPath();
            context.moveTo(dot.x, dot.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        context.fillStyle = `rgba(${rgb},0.55)`;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        context.fill();
      }

      frameId = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", render);
    };
  }, []);

  const enter = () => {
    setEntered(true);
    try {
      sessionStorage.setItem("ab_entered", "1");
    } catch {
      // No-op.
    }
  };

  const scrollToLevel = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return {
    active,
    canvasRef,
    enter,
    entered,
    progress,
    railHeight,
    railLineRef,
    scrollToLevel,
    visited,
  };
}

export default function App() {
  const state = useMissionConsole();

  return (
    <>
      <div id="bg" />
      <canvas id="particles" ref={state.canvasRef} />
      <div id="grid" />
      <div id="scan" />

      <div id="intro" className={state.entered ? "gone" : undefined}>
        <div className="intro-inner">
          <div className="intro-tag">Player Profile - Loading</div>
          <h1 className="intro-name">ABRAR&nbsp;BARI</h1>
          <div className="intro-sub">
            Computer Science - Artificial Intelligence - SWE
          </div>
          <button className="press-start" type="button" onClick={state.enter}>
            <span className="blink" />
            Press Start
          </button>
          <div className="intro-hint">Click or press Enter to begin</div>
        </div>
        <div className="intro-footer">
          A gamified version of my personal portfolio
        </div>
      </div>

      <div id="topbar" style={{ width: `${state.progress * 100}%` }} />

      <header className="hud">
        <a className="hud-id" href="#level-1" aria-label="Abrar Bari home">
          <div className="hud-orb">
            <b>A</b>
          </div>
          <div className="hud-name">
            Abrar Bari
            <small>Software Engineer</small>
          </div>
          <div className="hud-status" aria-label="Open to Work">
            <span className="pip" />
            Open to Work
          </div>
        </a>
        <div className="hud-meta">
          <div className="hud-links">
            <a
              className="resume-link"
              href={resumePdf}
              download="Abrar_Bari_Resume.pdf"
              aria-label="Download resume"
              title="Download resume"
            >
              <DownloadIcon />
              <span>Resume</span>
            </a>
            <a
              href="https://github.com/abbari6566"
              target="_blank"
              rel="noopener"
              aria-label="GitHub"
              title="GitHub"
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/abrar-bari"
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <a
              href="mailto:abrar.cs.401@gmail.com"
              aria-label="Email"
              title="abrar.cs.401@gmail.com"
            >
              <EmailIcon />
            </a>
          </div>
        </div>
      </header>

      <nav className="rail" aria-label="Level navigation">
        <div className="rail-line" ref={state.railLineRef} />
        <div
          className="rail-fill"
          style={{ height: `${state.railHeight}px` }}
        />
        {levels.map((level) => {
          const active = state.active === level.id;
          const done = state.visited.has(level.id);
          return (
            <button
              key={level.id}
              type="button"
              className={`rail-node${active ? " active" : ""}${done ? " done" : ""}`}
              onClick={() => state.scrollToLevel(level.id)}
            >
              <span className="num">{level.number}</span>
              <span className="tip">
                <b>{level.number}</b> - {level.label}
              </span>
            </button>
          );
        })}
      </nav>

      <main>
        <AboutLevel />
        <ExperienceLevel />
        <ProjectsLevel />
        <SkillsLevel />
        <GoalsLevel />
        <GitHubActivity />
        <BottomCta />
      </main>

      <footer>ABRAR BARI</footer>
    </>
  );
}

function LevelHeading({
  level,
  kicker,
  title,
  accent,
  description,
}: {
  level: string;
  kicker: string;
  title: string;
  accent: string;
  description?: string;
}) {
  return (
    <div className="level-head reveal">
      <div className="level-tag">
        <span className="bar" /> <span className="lv">{level}</span> - {kicker}
      </div>
      <h2 className="level-title">
        {title} <span className="accent">{accent}</span>
      </h2>
      {description && <p className="level-desc">{description}</p>}
    </div>
  );
}

function AboutLevel() {
  return (
    <section className="level" id="level-1">
      <LevelHeading
        level="Level 01"
        kicker="Origin"
        title="About"
        accent="the Player"
      />

      <div className="about-grid">
        <div className="avatar-card glass reveal d1">
          <div className="avatar-frame">
            <span className="avatar-corner c-tl" />
            <span className="avatar-corner c-tr" />
            <span className="avatar-corner c-bl" />
            <span className="avatar-corner c-br" />
            <img src={portraitImage} alt="Portrait of Abrar Bari" />
          </div>
          <div className="avatar-badge">
            <span className="lvl">Abrar Bari</span>
          </div>
        </div>

        <div className="about-body">
          <p className="about-lead reveal d1">
            Hi there, I am <b>Abrar</b>, a <b>Computer Science graduate</b> from
            Texas Tech University with a <b>4.00 GPA</b>, a Mathematics minor,
            and an AI concentration. I build full-stack applications and applied
            AI systems that are practical, scalable, and profitable.
          </p>
          <p className="about-text reveal d2">
            My work includes RAG platforms, backend systems, ML fairness
            pipelines, and computer vision research. I have built projects like{" "}
            <b>PaperPilot</b>, <b>InterviewCraft</b>, and{" "}
            <b>ManageMySubscription</b>, and I was selected as an AI Fellow
            through <b>Break Through Tech x Meta AI</b>.
          </p>
          <p className="about-text reveal d3">
            I do not have years of corporate history yet. What I do have is a
            GitHub full of real projects, strong fundamentals, and the hunger to
            keep building from scratch. I am actively looking for a new grad
            Software Engineering role where I can learn fast, contribute from
            day one, and work with people who care about shipping good products.
          </p>
        </div>
      </div>

      <div className="hire-reason glass reveal d4">
        <h3>You should hire me because...</h3>
        <p>
          I care about the craft, not just the commit. I will show up curious,
          build with intent, and grow into more than you hired me for. I make
          sure I think past the feature to the outcome - what actually makes the
          product, and the business, better.
        </p>
      </div>
    </section>
  );
}

function ExperienceLevel() {
  const experiences = [
    {
      role: "Undergraduate Research Assistant",
      when: "Sept 2025 - May 2026",
      org: "Dept. of Chemical Engineering, Texas Tech University",
      where: "Lubbock, TX",
      bullets: [
        <>
          Developed a <b>transfer-learning CNN pipeline</b> using ResNet-V2 for
          binary classification of sickle vs. healthy red blood cells on CTV
          image sequences -{" "}
          <span className="xp-metric">80% validation accuracy</span> and F1
          scores of 82% / 80% on a balanced 244-image dataset.
        </>,
        <>
          Engineered an overlapping tiling algorithm for <b>2048 x 1536</b>{" "}
          microscopic images using <b>YOLOv8/v11</b> object detection -{" "}
          <span className="xp-metric">95% precision</span> and 93% recall across
          RBC classes, while co-authoring a research paper on blood-smear
          analysis.
        </>,
      ],
      tags: ["TensorFlow", "ResNet-V2", "YOLOv8/v11", "Computer Vision"],
    },
    {
      role: "Machine Learning Fellow",
      when: "Aug 2025 - Dec 2025",
      org: "AI Studio Fellow @ Meta AI - Break Through Tech, Cornell University",
      where: "Remote",
      bullets: [
        <>
          Fine-tuned and published <b>BERTForSequenceClassification</b> to the{" "}
          <b>Hugging Face Hub</b> on 11K+ Reddit comments for demographic bias
          detection - <span className="xp-metric">82% accuracy</span>, F1 of
          0.84 via hyperparameter grid search.
        </>,
        <>
          Devised a fairness-evaluation pipeline with per-category subgroup
          analysis across <b>5 demographic slices</b>, benchmarking on{" "}
          <b>CrowS-Pairs</b> and <b>BBQ</b> to surface domain shift and bias
          blind spots.
        </>,
      ],
      tags: ["Hugging Face", "BERT", "Fairness ML", "Python", "PyTorch"],
    },
    {
      role: "Undergraduate Teaching Assistant",
      when: "Aug 2025 - May 2026",
      org: "Dept. of Computer Science, Texas Tech University",
      where: "Lubbock, TX",
      bullets: [
        <>
          Facilitated weekly office hours for{" "}
          <b>CS 2413 Data Structures (DS-I)</b>, guiding 70+ students through
          arrays, stacks, queues, linked lists, hash maps, binary trees, and
          recursion in C.
        </>,
        <>
          Evaluated and graded weekly labs, midterms, and projects while
          proctoring exams, delivering timely, constructive feedback that
          improved student comprehension.
        </>,
      ],
      tags: ["C", "Algorithms", "Mentorship"],
    },
    {
      role: "IT Supervisor",
      when: "Sept 2023 - Aug 2025",
      org: "IT Help Central, Texas Tech University",
      where: "Lubbock, TX",
      bullets: [
        <>
          Supervised and mentored a team supporting a{" "}
          <b>35,000+ student campus</b> across Microsoft 365, Canvas, network,
          hardware, and dorm infrastructure, cutting average resolution time by{" "}
          <span className="xp-metric">25%</span>.
        </>,
        <>
          Orchestrated campus-wide incident-response workflows in{" "}
          <b>ServiceNow</b>, coordinating cross-department escalations and
          real-time coaching to lift ticket-resolution accuracy by{" "}
          <span className="xp-metric">15%</span>.
        </>,
      ],
      tags: ["ServiceNow", "Leadership", "Incident Response"],
    },
  ];

  return (
    <section className="level" id="level-2">
      <LevelHeading
        level="Level 02"
        kicker="Campaign Log"
        title="Experience"
        accent="Unlocked"
        description="Four runs across research labs, classrooms, and IT operations - each one leveling up a different skill tree."
      />

      <div className="xp-list">
        {experiences.map((item) => (
          <article className="xp glass reveal d1" key={item.role}>
            <div className="xp-top">
              <h3 className="xp-role">{item.role}</h3>
              <span className="xp-when">{item.when}</span>
            </div>
            <div className="xp-org">
              {item.org} <span className="where">- {item.where}</span>
            </div>
            <ul className="xp-bullets">
              {item.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
            <div className="xp-tags">
              {item.tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsLevel() {
  const projects = [
    {
      no: "01",
      name: "InterviewCraft",
      description: (
        <>
          An <b>AI interview-prep platform</b> that generates role-specific
          questions, structured feedback, and guided mock-interview workflows.
          Production-ready REST APIs with <b>Prisma ORM + Zod</b> validation,
          HttpOnly cookies, strict CORS, and route-level rate limiting.
        </>
      ),
      stack: [
        "Next.js",
        "TypeScript",
        "Express",
        "PostgreSQL",
        "Prisma",
        "Zod",
      ],
      links: [
        {
          label: "Live Demo",
          href: "https://interview-craft-one.vercel.app/",
          icon: "external",
        },
        {
          label: "GitHub",
          href: "https://github.com/abbari6566/InterviewCraft",
          icon: "github",
        },
      ],
    },
    {
      no: "02",
      name: "PaperPilot",
      description: (
        <>
          A production-grade <b>RAG platform</b> for grounding answers in
          research papers - hybrid-search tuning and an async PDF ingestion +
          embedding pipeline (<b>BullMQ</b>, OpenAI embeddings, <b>pgvector</b>)
          that processes full papers in under <b>2 minutes</b>, containerized
          with Docker.
        </>
      ),
      stack: ["Next.js", "pgvector", "BullMQ", "Redis", "OpenAI", "Docker"],
      links: [
        {
          label: "GitHub",
          href: "https://github.com/abbari6566/PaperPilot",
          icon: "github",
        },
      ],
    },
    {
      no: "03",
      name: "ManageMySubscription",
      description: (
        <>
          A secure subscription-management platform with{" "}
          <b>11 REST API routes</b> - JWT auth, bcrypt hashing, ownership-based
          access control, and Arcjet token-bucket rate limiting. Backed by a
          normalized PostgreSQL schema with SQL-enforced integrity and an
          automated <b>5-day renewal-reminder workflow</b> across billing
          frequencies, currencies, and categories.
        </>
      ),
      stack: [
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Docker",
        "JWT",
      ],
      links: [
        {
          label: "GitHub",
          href: "https://github.com/abbari6566/ManageMySubscription",
          icon: "github",
        },
      ],
    },
    {
      no: "04",
      name: "Taskr",
      description: (
        <>
          A distributed task queue built from scratch in <b>Python</b> with
          Celery-like transparency. FastAPI producers push tasks into Redis
          priority queues while workers use <b>BRPOPLPUSH</b> for reliable
          processing, with retry scheduling, crash recovery, heartbeats, and a
          live dashboard.
        </>
      ),
      stack: [
        "Python",
        "FastAPI",
        "Redis",
        "Docker Compose",
        "Jinja2",
        "AsyncIO",
      ],
      links: [
        {
          label: "GitHub",
          href: "https://github.com/abbari6566/Taskr",
          icon: "github",
        },
      ],
    },
  ];
  const activeProjects = [
    {
      name: ".DOT",
      description: (
        <>
          <b>The ultimate productivity app.</b>
        </>
      ),
      stack: ["Active Build", "Productivity"],
      links: [],
    },
  ];

  return (
    <section className="level" id="level-3">
      <LevelHeading
        level="Level 03"
        kicker="Inventory"
        title="Projects"
        accent="Showcase"
        description="Production-grade builds - full-stack platforms with real auth, queues, vectors, and AI under the hood."
      />

      <div className="proj-grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            delayClass={index === 1 ? "d2" : "d1"}
          />
        ))}
      </div>

      <div className="active-quest reveal d2">
        <span>Active Quest</span>
        <h3>Actively Working On</h3>
      </div>

      <div className="proj-grid active-grid">
        {activeProjects.map((project) => (
          <ProjectCard key={project.name} project={project} delayClass="d3" />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  delayClass,
}: {
  project: {
    no?: string;
    name: string;
    description: JSX.Element;
    stack: string[];
    links: Array<{ label: string; href: string; icon: string }>;
  };
  delayClass: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rx = (y / rect.height - 0.5) * -6;
    const ry = (x / rect.width - 0.5) * 6;

    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
  };

  const onMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <article
      ref={cardRef}
      className={`proj glass reveal ${delayClass}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="proj-glow" ref={glowRef} />
      <div className="proj-head">
        <div>
          {project.no ? <div className="proj-no">{project.no}</div> : null}
          <h3 className="proj-name">{project.name}</h3>
        </div>
        <div className="proj-links">
          {project.links.map((link) => (
            <a
              href={link.href}
              target="_blank"
              rel="noopener"
              title={link.label}
              aria-label={link.label}
              key={link.label}
            >
              {link.icon === "external" ? <ExternalIcon /> : <GithubIcon />}
            </a>
          ))}
        </div>
      </div>
      <p className="proj-desc">{project.description}</p>
      <div className="proj-stack">
        {project.stack.map((tag) => (
          <span className="proj-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function SkillsLevel() {
  const branches = [
    {
      icon: <CodeIcon />,
      title: "Languages",
      subtitle: "Core Branch",
      skills: [
        "Python",
        "JavaScript",
        "TypeScript",
        "C",
        "Java",
        "SQL",
        "HTML",
        "CSS",
      ],
    },
    {
      icon: <NetworkIcon />,
      title: "AI / ML & Frameworks",
      subtitle: "Intelligence Branch",
      skills: [
        "PyTorch",
        "TensorFlow",
        "Hugging Face",
        "LangChain",
        "LangGraph",
        "RAG",
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "Prisma",
      ],
    },
    {
      icon: <FolderIcon />,
      title: "Data & Tooling",
      subtitle: "Infrastructure Branch",
      skills: [
        "Docker",
        "AWS",
        "PostgreSQL",
        "MongoDB",
        "Pinecone",
        "Redis",
        "BullMQ",
        "Git",
        "Vercel",
        "Render",
        "Postman",
        "Tableau",
        "Jira",
      ],
    },
  ];

  return (
    <section className="level" id="level-4">
      <LevelHeading
        level="Level 04"
        kicker="Skill Tree"
        title="Technical"
        accent="Abilities"
        description="Three branches, fully unlocked - languages, the AI/ML stack, and the tooling that ships it."
      />

      <div className="skill-tree">
        {branches.map((branch, index) => (
          <div
            className={`branch glass reveal d${index + 1}`}
            key={branch.title}
          >
            <div className="branch-head">
              <div className="branch-ic">{branch.icon}</div>
              <div>
                <h3>{branch.title}</h3>
                <span>{branch.subtitle}</span>
              </div>
            </div>
            <div className="skill-chips">
              {branch.skills.map((skill) => (
                <span className="skill" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GitHubActivity() {
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [weeks, setWeeks] = useState<CalendarDay[][]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const monthLabels = getMonthLabels(weeks);
  const isCurrentRange = selectedYear === currentYear;
  const titleRange = isCurrentRange ? "in the last year" : `in ${selectedYear}`;

  useEffect(() => {
    const controller = new AbortController();

    const loadContributions = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(getContributionsUrl(selectedYear), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`GitHub responded with ${response.status}`);
        }

        const data = (await response.json()) as ContributionResponse;
        const contributions = data.contributions ?? [];
        setWeeks(buildContributionWeeks(contributions));
        setTotal(
          (isCurrentRange
            ? data.total.lastYear
            : data.total[String(selectedYear)]) ??
            contributions.reduce((sum, day) => sum + day.count, 0),
        );
        setLastUpdated(
          new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("GitHub activity is temporarily unavailable.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadContributions();
    const interval = window.setInterval(
      loadContributions,
      contributionsRefreshMs,
    );

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [isCurrentRange, selectedYear]);

  return (
    <section
      className="github-activity"
      aria-labelledby="github-activity-title"
    >
      <div className="github-shell glass reveal d1">
        <div className="github-head">
          <div>
            <div className="level-tag github-tag">
              <span className="bar" /> Live Sync
            </div>
            <h2 className="github-title" id="github-activity-title">
              {total.toLocaleString()} contributions {titleRange}
            </h2>
          </div>
          <a
            className="github-profile"
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener"
          >
            <GithubIcon />@{githubUsername}
          </a>
        </div>

        {isLoading ? (
          <div className="github-empty">Fetching contribution graph...</div>
        ) : error ? (
          <div className="github-empty">{error}</div>
        ) : (
          <>
            <div className="contrib-panel">
              <div className="contrib-main">
                <div className="contrib-months" aria-hidden="true">
                  {monthLabels.map((month, index) => (
                    <span key={`${month}-${index}`}>{month}</span>
                  ))}
                </div>
                <div className="contrib-grid-wrap">
                  <div className="contrib-days" aria-hidden="true">
                    <span />
                    <span>Mon</span>
                    <span />
                    <span>Wed</span>
                    <span />
                    <span>Fri</span>
                    <span />
                  </div>
                  <div
                    className="contrib-grid"
                    aria-label={`${total.toLocaleString()} GitHub contributions in the last year`}
                  >
                    {weeks.map((week, weekIndex) => (
                      <div className="contrib-week" key={week[0].date}>
                        {week.map((day) => (
                          <a
                            className="contrib-cell"
                            data-level={day.level}
                            data-padding={day.isPadding ? "true" : undefined}
                            href={`https://github.com/${githubUsername}?tab=overview&from=${day.date}&to=${day.date}`}
                            target="_blank"
                            rel="noopener"
                            title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatContributionDate(day.date)}`}
                            aria-label={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatContributionDate(day.date)}`}
                            key={`${weekIndex}-${day.date}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="contrib-years" aria-label="Contribution year">
                {availableYears.map((year) => (
                  <button
                    className={year === selectedYear ? "active" : undefined}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    key={year}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="github-foot">
              <a
                href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile"
                target="_blank"
                rel="noopener"
              >
                Learn how GitHub counts contributions
              </a>
              <span className="contrib-legend">
                Less
                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    className="contrib-cell legend-cell"
                    data-level={level}
                    key={level}
                  />
                ))}
                More
              </span>
              <span>Auto-refreshes hourly</span>
              {lastUpdated && <span>Last checked {lastUpdated}</span>}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function BottomCta() {
  return (
    <div className="goal-cta bottom-cta reveal d2">
      <a className="btn btn-primary" href="mailto:abrar.cs.401@gmail.com">
        <EmailIcon />
        Hire me!
      </a>
      <a
        className="btn btn-ghost"
        href={resumePdf}
        download="Abrar_Bari_Resume.pdf"
      >
        <DownloadIcon />
        Resume
      </a>
      <a
        className="btn btn-ghost"
        href="https://www.linkedin.com/in/abrar-bari"
        target="_blank"
        rel="noopener"
      >
        <LinkedinIcon />
        Connect
      </a>
    </div>
  );
}

function GoalsLevel() {
  return (
    <section className="level" id="level-5">
      <LevelHeading
        level="Level 05"
        kicker="Final Boss"
        title="Future"
        accent="Goals"
      />

      <div className="goal-wrap">
        <div className="goal-main glass reveal d1">
          <div className="boss-tag">
            <span className="dot" />
            Now Accepting the Challenge
          </div>
          <h3 className="goal-h">
            Seeking <span className="accent">SWE & AI</span> roles.
          </h3>
          <p className="goal-p">
            Graduated in May 2026 and ready to join a team building things that
            ship. I'm looking for new-grad Software Engineering and AI positions
            where I can keep working across the full stack and the model
            lifecycle, and grow fast alongside strong engineers.
          </p>
          <div className="goal-roles">
            <span className="role-chip">Software Engineer</span>
            <span className="role-chip">AI Engineer</span>
            <span className="role-chip">Full-Stack</span>
            <span className="role-chip">Applied Research</span>
          </div>
        </div>

        <div className="goal-side">
          <div className="status-card glass reveal d2">
            <div className="status-row">
              <span className="k">Status</span>
              <span className="v live">
                <span className="pip" /> Open to Work
              </span>
            </div>
            <div className="status-row">
              <span className="k">Available</span>
              <span className="v">July 2026</span>
            </div>
            <div className="status-row">
              <span className="k">Based In</span>
              <span className="v">Texas, United States</span>
            </div>
            <div className="status-row">
              <span className="k">Focus</span>
              <span className="v">SWE - AI/ML</span>
            </div>
            <div className="status-row">
              <span className="k">Email</span>
              <span className="v">abrar.cs.401@gmail.com</span>
            </div>
            <div className="status-row">
              <span className="k">GitHub</span>
              <span className="v">@abbari6566</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
