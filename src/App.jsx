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
  Sparkle,
  ShieldCheck,
  EnvelopeSimple,
  Phone,
  Browsers,
  Compass,
  VideoCamera,
  DeviceMobileCamera,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, proofs, disciplines, timeline } from "./data.js";

gsap.registerPlugin(ScrollTrigger);

const email = "itzaakash15@gmail.com";
const phone = "+91 85906 37715";
const phoneTel = "+918590637715";
const filters = [
  "All work",
  "Brand strategy",
  "Content & film",
  "Web & technology",
];
const external = { target: "_blank", rel: "noopener noreferrer" };

function ArrowLink({ href, children, className = "", newTab = false, ariaLabel }) {
  return (
    <a
      href={href}
      className={`arrow-link ${className}`}
      {...(newTab ? external : {})}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      <span className="arrow-box" aria-hidden="true">
        <ArrowUpRight size={18} weight="bold" />
      </span>
    </a>
  );
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!project) return;
    const dialog = ref.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) {
        dialog.close();
      }
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
            <X size={24} weight="bold" />
          </button>

          <div className="dialog-media-container">
            <img
              src={project.image}
              alt={project.alt}
              className="dialog-image"
              width="1200"
              height="800"
            />
            {project.metric && (
              <span className="dialog-badge">{project.metric}</span>
            )}
          </div>

          <div className="dialog-content">
            <div className="dialog-header-meta">
              <span className="badge-tag">{project.category}</span>
              <span className="meta-divider">•</span>
              <span className="dialog-discipline">{project.discipline}</span>
              <span className="meta-divider">•</span>
              <span className="dialog-year">{project.year}</span>
            </div>

            <h2 id="project-title">{project.title}</h2>
            <p className="dialog-lead">{project.summary}</p>

            <div className="dialog-section">
              <h3>Overview</h3>
              <p>{project.description}</p>
            </div>

            {project.problem && (
              <div className="dialog-section">
                <h3>The Brief & Problem</h3>
                <p>{project.problem}</p>
              </div>
            )}

            {project.role && (
              <div className="dialog-section">
                <h3>My Role</h3>
                <p className="role-highlight">{project.role}</p>
              </div>
            )}

            <div className="dialog-section">
              <h3>Scope & Work Delivered</h3>
              <ul className="dialog-list">
                {project.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {project.tools && project.tools.length > 0 && (
              <div className="dialog-section">
                <h3>Tools & Technologies</h3>
                <div className="tool-chips">
                  {project.tools.map((tool) => (
                    <span key={tool} className="tool-chip">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="dialog-section outcome-section">
              <h3>Verified Outcome</h3>
              <p className="outcome-text">{project.outcome}</p>
            </div>

            {project.link && (
              <div className="dialog-actions">
                <ArrowLink href={project.link} newTab className="btn-primary">
                  {project.linkLabel}
                </ArrowLink>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function App() {
  const root = useRef(null);
  const heroSection = useRef(null);
  const bgNameRef = useRef(null);
  const portraitCutoutRef = useRef(null);
  const auraRef = useRef(null);
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

  // Motion Choreography
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const hasAnchor = Boolean(window.location.hash && window.location.hash !== "#");
        const alreadySeen = sessionStorage.getItem("aakash_hero_intro_seen") === "true";

        // Initial states: applied immediately so subsequent elements are hidden at start
        gsap.set(".giant-letter", { yPercent: 115, scale: 1.04, opacity: 0 });
        gsap.set(".hero-portrait-cutout", { opacity: 0, y: 36 });
        gsap.set(".hero-backdrop-name", { filter: "brightness(1.6)" });
        gsap.set(".hero-portrait-aura", { scale: 0.65, opacity: 0 });
        gsap.set(".hero-mask-line > span", { yPercent: 115, opacity: 0 });
        gsap.set(".hero-badge", { opacity: 0, y: 16 });
        gsap.set([".hero-description", ".hero-actions > *", ".hero-location-tag"], {
          opacity: 0,
          y: 20,
        });
        gsap.set(".site-header", { opacity: 0, y: -12 });
        gsap.set(".hero-scroll-cue", { opacity: 0, y: 10 });

        // Coordinated entrance timeline (~2 seconds total)
        // Order: AAKASH -> my portrait -> headline, navigation, and supporting elements
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            try {
              sessionStorage.setItem("aakash_hero_intro_seen", "true");
            } catch {}
          },
        });

        // 0.00-0.65s: NAME FIRST
        // Crisp bottom-to-top typographic mask with short letter stagger
        tl.to(
          ".giant-letter",
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: 0.58,
            stagger: 0.04,
            ease: "power3.out",
          },
          0.0
        );

        // 0.55-1.25s: PORTRAIT SECOND
        // Reveal portrait with soft upward rise (36px) and opacity
        tl.to(
          ".hero-portrait-cutout",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          0.55
        );

        // As portrait arrives, gently reduce name brightness to settle as background layer
        tl.to(
          ".hero-backdrop-name",
          {
            filter: "brightness(1)",
            duration: 0.65,
            ease: "power2.inOut",
          },
          0.65
        );

        // Restrained lime light sweep behind shoulders
        tl.to(
          ".hero-portrait-aura",
          {
            scale: 1,
            opacity: 0.6,
            duration: 0.75,
            ease: "power2.out",
          },
          0.68
        );

        // 1.10-1.85s: CONTENT THIRD
        // Reveal headline line by line
        tl.to(
          ".hero-mask-line > span",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out",
          },
          1.10
        );

        // Role label / badge
        tl.to(
          ".hero-badge",
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          1.25
        );

        // Supporting description, CTAs, location tag
        tl.to(
          [".hero-description", ".hero-actions > *", ".hero-location-tag"],
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          1.35
        );

        // Site navigation & header
        tl.to(
          ".site-header",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          1.30
        );

        // 1.85-2.10s: FINISH
        // Reveal minimal scroll cue
        tl.to(
          ".hero-scroll-cue",
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          1.85
        );

        // Respect direct anchor links (e.g. #work) or already viewed intro
        if (hasAnchor || alreadySeen) {
          tl.progress(1);
        }

        // Scroll parallax on background name (moves slightly slower than foreground)
        if (bgNameRef.current && heroSection.current) {
          gsap.to(bgNameRef.current, {
            y: 90,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.4,
            },
          });
        }

        // General scroll reveals
        gsap.utils.toArray(".reveal").forEach((element) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
            clearProps: "all",
          });
        });

        // Reading progress indicator
        gsap.to(".reading-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.2,
          },
        });
      }, root);

      return () => ctx.revert();
    });

    return () => {
      mm.revert();
      clearTimeout(copyTimer.current);
    };
  }, []);

  // Keyboard navigation for menu
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Pointer depth on fine-pointer devices (keeps text and buttons rock-solid stable)
  function handleHeroPointerMove(event) {
    if (
      matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches ||
      !heroSection.current
    ) {
      return;
    }
    const rect = heroSection.current.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (event.clientY - rect.top) / rect.height - 0.5;

    if (bgNameRef.current) {
      gsap.to(bgNameRef.current, {
        x: xRatio * -16,
        y: yRatio * -10,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    if (portraitCutoutRef.current) {
      gsap.to(portraitCutoutRef.current, {
        x: xRatio * 18,
        y: yRatio * 12,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    if (auraRef.current) {
      gsap.to(auraRef.current, {
        x: xRatio * 22,
        y: yRatio * 14,
        duration: 0.75,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }

  function handleHeroPointerLeave() {
    if (bgNameRef.current) {
      gsap.to(bgNameRef.current, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    }
    if (portraitCutoutRef.current) {
      gsap.to(portraitCutoutRef.current, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    }
    if (auraRef.current) {
      gsap.to(auraRef.current, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    }
  }

  function changeFilter(value) {
    setFilter(value);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          ".project-card",
          { opacity: 0.35, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            clearProps: "all",
          }
        );
      }
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

  const filteredProjects = projects.filter(
    (project) => filter === "All work" || project.category === filter
  );

  return (
    <div ref={root} className="site-wrapper">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="reading-progress" aria-hidden="true" />

      {/* Atmospheric Background Grid & Glow */}
      <div className="bg-field" aria-hidden="true">
        <div className="bg-glow" />
        <div className="bg-grid" />
      </div>

      {/* Site Header */}
      <header className="site-header wrap">
        <a href="#" className="wordmark" aria-label="Aakash K home">
          <span className="brand-name">AAKASH</span>
          <span className="brand-accent">K.</span>
        </a>

        <nav
          aria-label="Main navigation"
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          id="main-nav"
        >
          {[
            ["Work", "work"],
            ["Proof", "proof"],
            ["About", "about"],
            ["Creator", "creator"],
            ["Journey", "journey"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="mobile-contact-cta"
            onClick={() => setMenuOpen(false)}
          >
            Let’s collaborate <ArrowUpRight size={18} />
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
          </button>

          <a className="header-contact-btn" href="#contact">
            <span>Let’s collaborate</span>
            <ArrowUpRight size={16} weight="bold" />
          </a>

          <button
            className="icon-button menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </header>

      <main id="main">
        {/* HERO SECTION */}
        <section
          className="hero wrap"
          aria-labelledby="hero-heading"
          ref={heroSection}
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={handleHeroPointerLeave}
        >
          {/* Huge "AAKASH" in the Background */}
          <div className="hero-backdrop-name" aria-hidden="true" ref={bgNameRef}>
            <div className="giant-letter-track">
              {"AAKASH".split("").map((letter, i) => (
                <span key={i} className="giant-letter-mask">
                  <span className="giant-letter">{letter}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Left Column Editorial Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              <span className="badge-text">
                Marketer • Brand Builder • AI &amp; Data Science Student
              </span>
            </div>

            <h1 id="hero-heading" className="hero-title">
              <span className="hero-mask-line">
                <span>I turn attention</span>
              </span>
              <span className="hero-mask-line">
                <span className="text-lime-accent">into impact.</span>
              </span>
            </h1>

            <div className="hero-support-group">
              <p className="hero-description">
                I’m Aakash K — blending brand strategy, content, and web
                development to help people and businesses stand out.
              </p>

              <div className="hero-actions">
                <a href="#work" className="btn-primary">
                  <span>Explore my work</span>
                  <ArrowDown size={18} weight="bold" />
                </a>

                <a href="#contact" className="btn-secondary">
                  <span>Let’s collaborate</span>
                  <ArrowUpRight size={18} weight="bold" />
                </a>
              </div>

              <div className="hero-location-tag">
                <Compass size={16} weight="duotone" />
                <span>Based between Coimbatore &amp; Tuticorin, Tamil Nadu</span>
              </div>
            </div>
          </div>

          {/* Right Column: Freestanding Portrait Cutout */}
          <div className="hero-portrait-stage">
            <div className="hero-portrait-aura" ref={auraRef} aria-hidden="true" />
            <div className="hero-portrait-cutout" ref={portraitCutoutRef}>
              <picture>
                <source srcSet="/images/aakash.webp" type="image/webp" />
                <img
                  src="/images/aakash.png"
                  alt="Aakash K, marketer, brand builder and creator"
                  fetchPriority="high"
                  width="682"
                  height="1024"
                  className="freestanding-portrait-img"
                />
              </picture>
            </div>
          </div>

          {/* Minimal Scroll Cue */}
          <div className="hero-scroll-cue" aria-hidden="true">
            <a href="#work" className="scroll-cue-link" tabIndex={-1}>
              <span className="scroll-cue-text">Scroll</span>
              <ArrowDown size={14} weight="bold" className="scroll-cue-arrow" />
            </a>
          </div>
        </section>

        {/* PROOF & CREDIBILITY SECTION */}
        <section
          className="proof-section wrap"
          id="proof"
          aria-label="Verified achievements and proof"
        >
          <div className="proof-grid">
            {proofs.map((proof, idx) => (
              <div key={idx} className="proof-card reveal">
                <div className="proof-top">
                  <span className="proof-number">{proof.value}</span>
                  {proof.badge && (
                    <span className="proof-badge">{proof.badge}</span>
                  )}
                </div>
                <h3 className="proof-title">{proof.label}</h3>
                <p className="proof-detail">{proof.detail}</p>
                {proof.link && (
                  <a
                    href={proof.link}
                    {...external}
                    className="proof-link"
                    aria-label={`Verify ${proof.label} on external site`}
                  >
                    <span>{proof.linkLabel}</span>
                    <ArrowUpRight size={14} weight="bold" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SELECTED WORK SECTION */}
        <section
          className="work-section section-space wrap"
          id="work"
          aria-labelledby="work-heading"
        >
          <div className="section-head reveal">
            <div className="section-label-group">
              <span className="section-pill">Selected Work</span>
              <span className="section-subtext">Case Studies &amp; Impact</span>
            </div>
            <h2 id="work-heading" className="section-title">
              Crafted with intention.
              <br />
              <span className="muted">Proven in the real world.</span>
            </h2>
          </div>

          <div className="work-toolbar reveal">
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
              {filteredProjects.length === 1
                ? "1 project"
                : `${filteredProjects.length} projects`}
            </span>
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                className={`project-card project-${project.id}`}
                onClick={() => setSelectedProject(project)}
                aria-label={`View ${project.title} project`}
              >
                <div className="project-image-box">
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                    width="900"
                    height="680"
                    className="project-thumb"
                  />
                  <div className="project-overlay">
                    <span className="project-cta-label">
                      <span>View case study</span>
                      <ArrowUpRight size={20} weight="bold" />
                    </span>
                  </div>
                  {project.metric && (
                    <span className="project-pill-badge">{project.metric}</span>
                  )}
                </div>

                <div className="project-body">
                  <div className="project-meta-line">
                    <span className="project-cat">{project.category}</span>
                    <span className="meta-sep">•</span>
                    <span className="project-disc">{project.discipline}</span>
                    <span className="meta-sep">•</span>
                    <span className="project-yr">{project.year}</span>
                  </div>

                  <h3 className="project-heading">{project.title}</h3>
                  <p className="project-summary">{project.summary}</p>

                  <div className="project-footer-affordance">
                    <span className="affordance-text">Read case study</span>
                    <span className="affordance-icon">
                      <ArrowUpRight size={18} weight="bold" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ABOUT & DISCIPLINES SECTION */}
        <section
          className="about-section section-space wrap"
          id="about"
          aria-labelledby="about-heading"
        >
          <div className="about-layout">
            <div className="about-narrative reveal">
              <div className="section-label-group">
                <span className="section-pill">About Aakash K</span>
              </div>
              <h2 id="about-heading" className="section-title">
                Different disciplines.
                <br />
                <span className="text-lime-accent">One connected vision.</span>
              </h2>

              <p className="about-lead">
                I don’t fit into one box — and I’ve stopped trying to.
              </p>

              <div className="about-prose">
                <p>
                  I’m Aakash, a marketer, creative director, and first-year
                  B.Tech Artificial Intelligence &amp; Data Science student at
                  Rathinam Technical Campus, based between Coimbatore and
                  Tuticorin, Tamil Nadu.
                </p>
                <p>
                  My journey began behind the camera in 2020. That experimentation
                  with camera angles, pacing, and storytelling evolved into
                  commercial video campaigns, personal branding systems, and
                  scalable web engineering.
                </p>
                <p>
                  I believe technology should solve real-world problems, while
                  creativity makes those solutions understandable, trusted, and
                  impossible to ignore.
                </p>
              </div>

              <div className="about-philosophy-card">
                <div className="philosophy-header">
                  <ShieldCheck size={22} weight="duotone" />
                  <span>My Creative Rule</span>
                </div>
                <div className="philosophy-steps">
                  <div className="step-item">
                    <span className="step-num">01</span>
                    <span className="step-text">Content <strong>first.</strong></span>
                  </div>
                  <div className="step-item">
                    <span className="step-num">02</span>
                    <span className="step-text">Design <strong>second.</strong></span>
                  </div>
                  <div className="step-item">
                    <span className="step-num">03</span>
                    <span className="step-text">Effects <strong>third.</strong></span>
                  </div>
                </div>
                <p className="philosophy-sub">
                  Confidence without arrogance. Creativity without chaos.
                  Technology without gimmicks.
                </p>
              </div>
            </div>

            {/* Disciplines Accordion */}
            <div className="disciplines-column reveal" id="disciplines">
              <div className="disciplines-header">
                <h3>Core Disciplines &amp; Services</h3>
                <p>Explore how I help individuals and businesses grow</p>
              </div>

              <div className="disciplines-accordion">
                {disciplines.map((item, index) => {
                  const isOpen = activeDiscipline === index;
                  return (
                    <div
                      className={`discipline-row ${isOpen ? "expanded" : ""}`}
                      key={item.name}
                    >
                      <button
                        className="discipline-btn"
                        aria-expanded={isOpen}
                        aria-controls={`discipline-${index}`}
                        onClick={() =>
                          setActiveDiscipline(isOpen ? null : index)
                        }
                      >
                        <div className="discipline-btn-left">
                          <span className="discipline-index">0{index + 1}</span>
                          <span className="discipline-name">{item.name}</span>
                          <span className="discipline-cue">{item.cue}</span>
                        </div>
                        <div className="discipline-icon-box">
                          {isOpen ? (
                            <Minus size={20} weight="bold" />
                          ) : (
                            <Plus size={20} weight="bold" />
                          )}
                        </div>
                      </button>

                      <div
                        id={`discipline-${index}`}
                        className="discipline-details"
                        hidden={!isOpen}
                      >
                        <p className="discipline-desc">{item.description}</p>
                        <div className="tag-list">
                          {item.tags.map((tag) => (
                            <span key={tag} className="tag-chip">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CREATOR PLATFORM SPOTLIGHT */}
        <section
          className="creator-section section-space wrap"
          id="creator"
          aria-labelledby="creator-heading"
        >
          <div className="creator-container">
            <div className="creator-visual reveal">
              <div className="creator-img-frame">
                <img
                  src="/images/creator.webp"
                  alt="Microphone held at an outdoor event during a commercial creator shoot"
                  loading="lazy"
                  width="750"
                  height="900"
                  className="creator-img"
                />
                <a
                  href="https://www.instagram.com/life.with_aakash/"
                  {...external}
                  className="play-pulse-btn"
                  aria-label="Watch Life With Aakash on Instagram"
                >
                  <Play weight="fill" size={26} />
                </a>
              </div>
            </div>

            <div className="creator-copy reveal">
              <div className="section-label-group">
                <span className="section-pill">Life with Aakash</span>
              </div>
              <h2 id="creator-heading" className="section-title">
                Behind the work,
                <br />
                <span className="text-lime-accent">there’s a human voice.</span>
              </h2>
              <p className="creator-lead">
                Honest stories about personal growth, creative discipline, and
                building something meaningful from scratch.
              </p>

              <div className="creator-stat-box">
                <div className="creator-stat-val">59.1K</div>
                <div className="creator-stat-text">
                  <strong>Peak Organic Reel Views</strong>
                  <span>Achieved on personal storytelling channel Life With Aakash</span>
                </div>
              </div>

              <div className="creator-links-group">
                <ArrowLink
                  href="https://www.instagram.com/life.with_aakash/"
                  newTab
                  className="btn-primary"
                >
                  Watch Life With Aakash
                </ArrowLink>

                <a
                  href="https://www.instagram.com/mr._aku_vlogs/"
                  {...external}
                  className="creator-origin-link"
                >
                  <span>Founded on Mr Aku Vlogs in 2020</span>
                  <ArrowUpRight size={16} weight="bold" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* JOURNEY & RECOGNITION SECTION */}
        <section
          className="journey-section section-space wrap"
          id="journey"
          aria-labelledby="journey-heading"
        >
          <div className="section-head reveal">
            <div className="section-label-group">
              <span className="section-pill">Evolution</span>
            </div>
            <h2 id="journey-heading" className="section-title">
              Still learning.
              <br />
              <span className="muted">Always building.</span>
            </h2>
          </div>

          <div className="journey-layout">
            <div className="timeline-track">
              {timeline.map((item, idx) => (
                <article className="timeline-card reveal" key={item.year + idx}>
                  <div className="timeline-marker">
                    <span className="timeline-dot" />
                    <span className="timeline-year">{item.year}</span>
                  </div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">{item.title}</h3>
                    <p className="timeline-desc">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="recognition-card reveal">
              <div className="recognition-image-wrapper">
                <img
                  src="/images/award.webp"
                  alt="Aakash receiving the Twin Heart Business Excellence Award"
                  loading="lazy"
                  width="500"
                  height="400"
                  className="recognition-img"
                />
              </div>

              <div className="recognition-content">
                <div className="recognition-badge">Honors &amp; Recognition</div>
                <h3 className="recognition-title">
                  Recognized for
                  <br />
                  showing up &amp; creating.
                </h3>
                <p className="recognition-text">
                  Recipient of the <strong>Twin Heart Business Excellence Award</strong> ("The Vlogging Kid") for digital storytelling and youth creator entrepreneurship, <strong>Best Reels Creator</strong> at the Tuticorin Creator Showcase, and the <strong>Young Informative Content Award</strong>.
                </p>
                <div className="recognition-meta">
                  <span className="rec-year">Creator Recognition / 2025</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section
          className="contact-section section-space wrap"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <div className="contact-box reveal">
            <div className="contact-head">
              <div className="section-label-group">
                <span className="section-pill">Start a Conversation</span>
              </div>
              <h2 id="contact-heading" className="contact-title">
                Your next idea.
                <br />
                <a href={`mailto:${email}`} className="contact-hero-link">
                  <span>Let’s make it happen.</span>
                  <ArrowUpRight size={38} weight="light" className="contact-arrow" />
                </a>
              </h2>
            </div>

            <div className="contact-grid">
              <div className="contact-block">
                <span className="contact-label">Direct Email</span>
                <div className="email-action-row">
                  <a className="email-link" href={`mailto:${email}`}>
                    {email}
                  </a>
                  <button
                    className="copy-button"
                    onClick={copyEmail}
                    aria-label={copied ? "Email copied" : "Copy email address"}
                  >
                    {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />}
                  </button>
                  <span className="copy-feedback" role="status">
                    {copied ? "Copied!" : ""}
                  </span>
                </div>
                <p className="contact-sub">Coimbatore &amp; Tuticorin, Tamil Nadu, India</p>
              </div>

              <div className="contact-block">
                <span className="contact-label">Phone &amp; WhatsApp</span>
                <a href={`tel:${phoneTel}`} className="phone-link">
                  <Phone size={18} weight="duotone" />
                  <span>{phone}</span>
                  <ArrowUpRight size={16} />
                </a>
                <p className="contact-sub">Available for client and agency collaborations</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer wrap">
        <div className="footer-left">
          <a className="wordmark" href="#" aria-label="Back to top">
            <span className="brand-name">AAKASH</span>
            <span className="brand-accent">K.</span>
          </a>
          <p className="footer-motto">Turning ideas into experiences.</p>
        </div>

        <div className="footer-center">
          <span className="footer-copy">
            © {new Date().getFullYear()} Aakash K. All rights reserved.
          </span>
        </div>

        <div className="footer-right">
          <div className="social-links" aria-label="Social profiles">
            <a
              href="https://www.instagram.com/life.with_aakash/"
              {...external}
              aria-label="Instagram"
              className="social-btn"
            >
              <InstagramLogo size={22} weight="bold" />
            </a>
            <a
              href="https://linkedin.com/in/aakash-k-028a2b389"
              {...external}
              aria-label="LinkedIn"
              className="social-btn"
            >
              <LinkedinLogo size={22} weight="bold" />
            </a>
            <a
              href="https://github.com/itzaakash15-creator"
              {...external}
              aria-label="GitHub"
              className="social-btn"
            >
              <GithubLogo size={22} weight="bold" />
            </a>
          </div>

          <a href="#" className="back-top-btn" aria-label="Back to top">
            <ArrowUpRight size={20} weight="bold" />
          </a>
        </div>
      </footer>

      {/* Project Case Study Dialog */}
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
