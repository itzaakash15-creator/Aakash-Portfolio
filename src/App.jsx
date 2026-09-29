import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Plus,
  Minus,
  X,
  Sun,
  Moon,
  List,
  Play,
  Copy,
  Check,
  InstagramLogo,
  GithubLogo,
  LinkedinLogo,
  Asterisk,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, disciplines, timeline } from "./data.js";

gsap.registerPlugin(ScrollTrigger);
const email = "itzaakash15@gmail.com";
const filters = [
  "All work",
  "Brand strategy",
  "Content & film",
  "Web & technology",
];
const external = { target: "_blank", rel: "noopener noreferrer" };

function ArrowLink({ href, children, className = "", newTab = false }) {
  return (
    <a
      href={href}
      className={`arrow-link ${className}`}
      {...(newTab ? external : {})}
    >
      {children}
      <span>
        <ArrowUpRight size={20} weight="regular" />
      </span>
    </a>
  );
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!project) return;
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, [project]);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="project-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {project && (
        <div className="dialog-body">
          <button
            className="icon-button dialog-close"
            aria-label="Close project"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <img src={project.image} alt={project.alt} className="dialog-image" />
          <div className="dialog-content">
            <span className="small-label">
              {project.discipline} / {project.year}
            </span>
            <h2 id="project-title">{project.title}</h2>
            <p>{project.description}</p>
            <h3>The work</h3>
            <ul>
              {project.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>The outcome</h3>
            <p>{project.outcome}</p>
            {project.link && (
              <ArrowLink href={project.link} newTab>
                {project.linkLabel}
              </ArrowLink>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function App() {
  const root = useRef(null);
  const portrait = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All work");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  const [theme, setTheme] = useState(() => {
    try {
      return (
        localStorage.getItem("aakash-theme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      );
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("aakash-theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from(".hero-copy > *", {
          y: 36,
          opacity: 0,
          duration: 1,
          stagger: 0.13,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.from(".portrait-stage", {
          y: 55,
          rotation: 4,
          opacity: 0,
          duration: 1.3,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.to(".hero-orbit", {
          rotation: 140,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.utils.toArray(".reveal").forEach((element) => {
          gsap.from(element, {
            y: 38,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
            clearProps: "all",
          });
        });
        gsap.from(".manifesto-line", {
          x: -35,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".manifesto",
            start: "top 85%",
            once: true,
          },
        });
        gsap.to(".reading-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }, root);
      return () => context.revert();
    });
    return () => {
      mm.revert();
      clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function movePortrait(event) {
    if (
      matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    gsap.to(portrait.current, {
      rotationY: ((event.clientX - rect.left) / rect.width - 0.5) * 9,
      rotationX: -((event.clientY - rect.top) / rect.height - 0.5) * 7,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  function changeFilter(value) {
    setFilter(value);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.fromTo(
          ".project-card",
          { opacity: 0.4, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            clearProps: "all",
          },
        );
    });
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="reading-progress" aria-hidden="true" />
      <header className="site-header wrap">
        <a href="#" className="wordmark" aria-label="Aakash home">
          aakash<span>K.</span>
        </a>
        <nav
          aria-label="Main navigation"
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          id="main-nav"
        >
          {[
            ["Work", "work"],
            ["About", "about"],
            ["Journey", "journey"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="mobile-contact"
            onClick={() => setMenuOpen(false)}
          >
            Let’s talk <ArrowUpRight />
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a className="header-contact" href="#contact">
            Let’s talk <ArrowUpRight size={17} />
          </a>
          <button
            className="icon-button menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="hero-intro">
              <span className="intro-line" /> Hey, I’m Aakash K.
            </p>
            <h1 id="hero-heading">
              Not one box.
              <br />A whole{" "}
              <span className="world-word">
                world
                <svg viewBox="0 0 300 18" aria-hidden="true">
                  <path d="M4 12 Q150 0 294 10" />
                </svg>
              </span>
              .
            </h1>
            <p className="hero-description">
              I build brands, tell stories, and connect creativity with
              technology. Always curious. Never one-dimensional.
            </p>
            <ArrowLink href="#work" className="primary-link">
              Explore my work
            </ArrowLink>
          </div>
          <div
            className="portrait-stage"
            onPointerMove={movePortrait}
            onPointerLeave={() =>
              gsap.to(portrait.current, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.7,
              })
            }
          >
            <div className="portrait-disc" aria-hidden="true" />
            <div className="hero-orbit" aria-hidden="true">
              <Asterisk weight="light" />
            </div>
            <div className="portrait-frame" ref={portrait}>
              <img
                src="/images/aakash.webp"
                alt="Aakash K, marketer, brand builder and creator"
                fetchPriority="high"
                width="678"
                height="1024"
              />
            </div>
            <div className="portrait-note">
              A little strategy.
              <br />A lot of curiosity.
            </div>
            <span className="portrait-signature" aria-hidden="true">
              ak.
            </span>
          </div>
        </section>
        <div className="role-bar wrap" aria-label="Explore my disciplines">
          {disciplines.map((item, index) => (
            <a
              href="#disciplines"
              key={item.name}
              onClick={() => setActiveDiscipline(index)}
            >
              {item.name}
              <ArrowUpRight size={19} />
            </a>
          ))}
        </div>

        <section
          className="work-section section-space wrap"
          id="work"
          aria-labelledby="work-heading"
        >
          <div className="section-heading reveal">
            <p className="small-label">Selected work</p>
            <h2 id="work-heading">
              Good ideas.
              <br />
              <span className="muted">Real-world impact.</span>
            </h2>
          </div>
          <div className="work-toolbar">
            <div className="filters" role="group" aria-label="Filter projects">
              {filters.map((item) => (
                <button
                  key={item}
                  className={filter === item ? "filter active" : "filter"}
                  aria-pressed={filter === item}
                  onClick={() => changeFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="work-count" aria-live="polite">
              {filter === "All work"
                ? projects.length
                : projects.filter((p) => p.category === filter).length}{" "}
              projects
            </span>
          </div>
          <div className="project-grid">
            {projects
              .filter(
                (project) =>
                  filter === "All work" || project.category === filter,
              )
              .map((project) => (
                <button
                  key={project.id}
                  className={`project-card project-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  aria-label={`View ${project.title} project`}
                >
                  <div className="project-image">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      width="900"
                      height="680"
                    />
                    <span className="project-open">
                      <ArrowUpRight size={27} />
                    </span>
                  </div>
                  <div className="project-meta">
                    <span>{project.discipline}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </button>
              ))}
          </div>
        </section>

        <section
          className="about-section section-space wrap"
          id="about"
          aria-labelledby="about-heading"
        >
          <div className="about-heading reveal">
            <Asterisk className="about-star" size={54} weight="light" />
            <h2 id="about-heading">
              Different interests.
              <br />
              One connected mind.
            </h2>
          </div>
          <div className="about-body">
            <p className="about-lead reveal">
              I don’t fit into one box.
              <br />
              And I’ve stopped trying to.
            </p>
            <div className="about-prose reveal">
              <p>
                I’m Aakash, a marketer, creator and AI & Data Science student
                based between Coimbatore and Tuticorin, Tamil Nadu.
              </p>
              <p>
                What started with a camera in 2020 became a curiosity about why
                people stop, watch, trust, and act. Today, I bring that
                curiosity to brands, digital experiences, and technology.
              </p>
              <p>
                I believe technology should solve real problems. Creativity
                should make those solutions understandable and memorable.
              </p>
              <a href="#journey" className="text-link">
                The story so far <ArrowDown size={18} />
              </a>
            </div>
          </div>
          <div className="disciplines" id="disciplines">
            {disciplines.map((item, index) => (
              <div
                className={`discipline ${activeDiscipline === index ? "expanded" : ""}`}
                key={item.name}
              >
                <h3>
                  <button
                    aria-expanded={activeDiscipline === index}
                    aria-controls={`discipline-${index}`}
                    onClick={() =>
                      setActiveDiscipline(
                        activeDiscipline === index ? null : index,
                      )
                    }
                  >
                    <span>{item.name}</span>
                    <span className="discipline-cue">{item.cue}</span>
                    {activeDiscipline === index ? (
                      <Minus size={24} />
                    ) : (
                      <Plus size={24} />
                    )}
                  </button>
                </h3>
                <div
                  id={`discipline-${index}`}
                  className="discipline-details"
                  hidden={activeDiscipline !== index}
                >
                  <p>{item.description}</p>
                  <div className="tag-list">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="creator-section section-space wrap"
          id="creator"
          aria-labelledby="creator-heading"
        >
          <div className="creator-visual reveal">
            <img
              src="/images/creator.webp"
              alt="A microphone held at an outdoor event during a creator shoot"
              loading="lazy"
              width="750"
              height="900"
            />
            <a
              href="https://www.instagram.com/life.with_aakash/"
              {...external}
              className="play-link"
              aria-label="Watch Life With Aakash on Instagram"
            >
              <Play weight="fill" size={25} />
            </a>
          </div>
          <div className="creator-copy reveal">
            <p className="small-label">Life with Aakash</p>
            <h2 id="creator-heading">
              Behind the work,
              <br />
              there’s a human.
            </h2>
            <p>
              Honest stories about growth, discipline, and figuring it out as
              you go. A space to share what I’m learning, not pretend I have
              every answer.
            </p>
            <div className="creator-stat">
              <strong>59.1K</strong>
              <span>
                peak organic reel views
                <br />
                on Life With Aakash
              </span>
            </div>
            <ArrowLink
              href="https://www.instagram.com/life.with_aakash/"
              newTab
            >
              Meet the creator
            </ArrowLink>
            <a
              href="https://www.instagram.com/mr._aku_vlogs/"
              {...external}
              className="creator-origin"
            >
              It began with Mr Aku Vlogs in 2020 <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        <section
          className="journey-section section-space wrap"
          id="journey"
          aria-labelledby="journey-heading"
        >
          <h2 id="journey-heading" className="reveal">
            Still learning.
            <br />
            <span className="muted">Always building.</span>
          </h2>
          <div className="timeline">
            {timeline.map((item) => (
              <article className="timeline-item reveal" key={item.year}>
                <span className="timeline-year">{item.year}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="recognition reveal">
            <img
              src="/images/award.webp"
              alt="Aakash receiving the Twin Heart Business Excellence Award"
              loading="lazy"
              width="500"
              height="400"
            />
            <div>
              <span className="small-label">A few meaningful milestones</span>
              <h3>
                Recognized for
                <br />
                showing up.
              </h3>
              <p>
                Twin Heart Business Excellence Award, Best Reels Creator at the
                Tuticorin Creator Showcase, and the Young Informative Content
                Award.
              </p>
              <span className="recognition-year">
                Creator recognition / 2025
              </span>
            </div>
          </div>
        </section>

        <section
          className="manifesto section-space wrap"
          aria-label="My creative philosophy"
        >
          <p>My creative rule is simple.</p>
          <div className="manifesto-line">
            Content <span>first.</span>
          </div>
          <div className="manifesto-line">
            Design <span>second.</span>
          </div>
          <div className="manifesto-line">
            Effects <span>third.</span>
          </div>
          <div className="manifesto-foot">
            <Asterisk size={34} weight="light" />
            <p>
              Confidence without arrogance.
              <br />
              Creativity without chaos.
              <br />
              Technology without gimmicks.
            </p>
          </div>
        </section>

        <section
          className="contact-section section-space wrap"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <p className="small-label">Have an idea in mind?</p>
          <h2 id="contact-heading">
            Let’s make
            <br />
            <a href={`mailto:${email}`}>
              something matter.
              <ArrowUpRight weight="light" />
            </a>
          </h2>
          <div className="contact-bottom">
            <div>
              <a className="email-link" href={`mailto:${email}`}>
                {email}
              </a>
              <button
                className="copy-button"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email address"}
              >
                {copied ? <Check size={19} /> : <Copy size={19} />}
              </button>
              <span className="copy-feedback" role="status">
                {copied ? "Copied!" : ""}
              </span>
              <p>Coimbatore & Tuticorin, Tamil Nadu, India</p>
            </div>
            <a href="tel:+918590637715" className="phone-link">
              +91 85906 37715 <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer wrap">
        <a className="wordmark" href="#">
          aakash<span>K.</span>
        </a>
        <p>Turning ideas into experiences.</p>
        <div className="social-links">
          <a
            href="https://www.instagram.com/life.with_aakash/"
            {...external}
            aria-label="Instagram"
          >
            <InstagramLogo size={22} />
          </a>
          <a
            href="https://linkedin.com/in/aakash-k-028a2b389"
            {...external}
            aria-label="LinkedIn"
          >
            <LinkedinLogo size={22} />
          </a>
          <a
            href="https://github.com/itzaakash15-creator"
            {...external}
            aria-label="GitHub"
          >
            <GithubLogo size={22} />
          </a>
        </div>
        <a href="#" className="back-top" aria-label="Back to top">
          <ArrowUpRight size={23} />
        </a>
      </footer>
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
