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
  const frontNameRef = useRef(null);
  const portraitCutoutRef = useRef(null);
  const auraRef = useRef(null);
  const lightSweepRef = useRef(null);
  const bottomBarRef = useRef(null);

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

  // Motion Choreography: "AAKASH — Behind the Name" (~2.5s title sequence)
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const hasAnchor = Boolean(window.location.hash && window.location.hash !== "#");
        const alreadySeen = sessionStorage.getItem("aakash_hero_intro_seen") === "true";

        // Initial states: applied immediately so subsequent elements are hidden at start
        gsap.set(".hero-char", { yPercent: 120, rotateX: -24, opacity: 0 });
        gsap.set(".hero-wordmark-track", { letterSpacing: "0.06em" });
        gsap.set([bgNameRef.current, frontNameRef.current], { y: "0vh", scale: 1 });
        gsap.set(lightSweepRef.current, { xPercent: -150, opacity: 0 });
        gsap.set(portraitCutoutRef.current, {
          y: 40,
          scale: 1.035,
          opacity: 0,
          clipPath: "inset(14% 0% 0% 0%)",
        });
        gsap.set(frontNameRef.current, { opacity: 0 });
        gsap.set(auraRef.current, { scale: 0.65, opacity: 0 });
        gsap.set(".site-header", { opacity: 0, y: -16 });
        gsap.set(".hero-bottom-bar > *", { opacity: 0, y: 16 });

        // Coordinated 4-act entrance timeline
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            try {
              sessionStorage.setItem("aakash_hero_intro_seen", "true");
            } catch {}
          },
        });

        // ACT 1: THE NAME (0.00 to 0.85s)
        // Letters rise from below baseline with slight perspective rotation into a crisp straight word.
        // Stagger of 55ms between letters, spacing settles from wider to tight.
        tl.to(
          ".hero-char",
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.055,
            ease: "power4.out",
          },
          0.0
        );

        tl.to(
          ".hero-wordmark-track",
          {
            letterSpacing: "-0.04em",
            duration: 0.82,
            ease: "power3.out",
          },
          0.0
        );

        // ACT 2: MAKE ROOM FOR THE PERSON (0.75 to 1.30s)
        // Smoothly translate and scale lettering into final position behind portrait.
        tl.to(
          [bgNameRef.current, frontNameRef.current],
          {
            y: "-8vh",
            scale: 0.94,
            duration: 0.65,
            ease: "power3.inOut",
          },
          0.75
        );

        // Narrow lime light sweep across behind future portrait position
        tl.fromTo(
          lightSweepRef.current,
          {
            xPercent: -150,
            opacity: 0,
          },
          {
            xPercent: 150,
            opacity: 0.8,
            duration: 0.55,
            ease: "power2.inOut",
          },
          0.80
        );

        tl.to(
          lightSweepRef.current,
          {
            opacity: 0,
            duration: 0.25,
            ease: "power1.out",
          },
          1.30
        );

        // ACT 3: PORTRAIT REVEAL (1.00 to 1.85s)
        // Portrait reveals using rising mask, small upward translation, subtle scale settle 1.035 to 1
        tl.to(
          portraitCutoutRef.current,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.85,
            ease: "power3.out",
          },
          1.00
        );

        // Front outline layer fades in over lower torso
        tl.to(
          frontNameRef.current,
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          1.20
        );

        // Restrained lime ambient light aura blooms behind shoulders
        tl.to(
          auraRef.current,
          {
            scale: 1,
            opacity: 0.6,
            duration: 0.8,
            ease: "power2.out",
          },
          1.05
        );

        // ACT 4: THE INTERFACE ARRIVES (1.75 to 2.50s)
        // Navigation downward reveal
        tl.to(
          ".site-header",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          1.75
        );

        // Caption, explore work link, and scroll cue with understated staggered movement
        tl.to(
          ".hero-bottom-bar > *",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: "power2.out",
          },
          1.90
        );

        // Respect direct anchor links (e.g. #work) or already viewed intro
        if (hasAnchor || alreadySeen) {
          tl.progress(1);
        }

        // Scroll parallax: background name moves slightly slower than portrait
        if (bgNameRef.current && heroSection.current) {
          gsap.to([bgNameRef.current, frontNameRef.current], {
            y: 110,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.4,
            },
          });
        }

        // Introduction section scroll reveal: line-by-line reveal on headline
        gsap.from(".intro-mask-line > span", {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".intro-section",
            start: "top 82%",
            once: true,
          },
          clearProps: "all",
        });

        // Intro supporting elements
        gsap.from(
          [".intro-badge", ".intro-description", ".intro-actions", ".intro-location-tag"],
          {
            y: 28,
            opacity: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".intro-section",
              start: "top 78%",
              once: true,
            },
            clearProps: "all",
          }
        );

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
      gsap.to([bgNameRef.current, frontNameRef.current], {
        x: xRatio * -14,
        y: yRatio * -8,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    if (portraitCutoutRef.current) {
      gsap.to(portraitCutoutRef.current, {
        x: xRatio * 14,
        y: yRatio * 8,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    if (auraRef.current) {
      gsap.to(auraRef.current, {
        x: xRatio * 18,
        y: yRatio * 10,
        duration: 0.75,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }

  function handleHeroPointerLeave() {
    if (bgNameRef.current) {
      gsap.to([bgNameRef.current, frontNameRef.current], { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    }
    if (portraitCutoutRef.current) {
      gsap.to(portraitCutoutRef.current, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    }
    if (auraRef.current) {
      gsap.to(auraRef.current, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    }
  }

  // Magnetic button microinteraction for fine-pointer devices
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const buttons = document.querySelectorAll(".magnetic-btn");
    const cleanups = [];

    buttons.forEach((btn) => {
      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.22;
        gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      };
      const onLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
      };
      btn.addEventListener("pointermove", onMove);
      btn.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("pointermove", onMove);
        btn.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

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
        {/* HERO SECTION: Centred Title Sequence Stage */}
        <section
          className="hero-stage"
          id="hero"
          aria-label="Aakash K hero introduction"
          ref={heroSection}
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={handleHeroPointerLeave}
        >
          {/* Restrained radial ambient light behind portrait */}
          <div className="hero-portrait-aura" ref={auraRef} aria-hidden="true" />

          {/* Narrow lime light sweep across behind portrait (Act 2) */}
          <div className="hero-light-sweep" ref={lightSweepRef} aria-hidden="true" />

          {/* Huge "AAKASH" Background Layer (Behind Portrait) */}
          <div className="hero-wordmark-container" ref={bgNameRef} aria-hidden="true">
            <div className="hero-wordmark-track hero-wordmark-back">
              {"AAKASH".split("").map((letter, i) => (
                <span key={i} className="hero-char-mask">
                  <span className="hero-char">{letter}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Centred Freestanding Cutout (approx 80% available hero height) */}
          <div className="hero-portrait-wrap" ref={portraitCutoutRef}>
            <picture>
              <source srcSet="/images/aakash.webp" type="image/webp" />
              <img
                src="/images/aakash.png"
                alt="Aakash K, marketer, brand builder and creator"
                fetchPriority="high"
                width="682"
                height="1024"
                className="hero-portrait-freestanding"
              />
            </picture>
          </div>

          {/* Subtle Duplicate Outline Layer in front of Lower Torso ONLY (never over face) */}
          <div className="hero-wordmark-front-container" ref={frontNameRef} aria-hidden="true">
            <div className="hero-wordmark-track hero-wordmark-front">
              {"AAKASH".split("").map((letter, i) => (
                <span key={i} className="hero-char-mask">
                  <span className="hero-char hero-char-front">{letter}</span>
                </span>
              ))}
            </div>
          </div>

          {/* First-Screen Bottom Bar: Caption, Explore Link, and Scroll Cue */}
          <div className="hero-bottom-bar" ref={bottomBarRef}>
            <p className="hero-caption">Creative mind. Real-world impact.</p>

            <div className="hero-affordances">
              <a href="#work" className="hero-explore-link">
                <span className="explore-text">Explore work</span>
                <span className="explore-arrow">
                  <ArrowDown size={14} weight="bold" />
                </span>
              </a>

              <a
                href="#intro"
                className="hero-scroll-cue"
                aria-label="Scroll to introduction"
              >
                <span className="scroll-indicator-line" />
              </a>
            </div>
          </div>
        </section>

        {/* INTRODUCTION SECTION: Service & Brand Lead (Immediately Below Hero) */}
        <section
          className="intro-section wrap"
          id="intro"
          aria-labelledby="intro-heading"
        >
          <div className="intro-container">
            <div className="intro-badge">
              <span className="badge-dot" />
              <span className="badge-text">
                Marketer • Brand Builder • AI &amp; Data Science Student
              </span>
            </div>

            <h1 id="intro-heading" className="intro-title">
              <span className="intro-mask-line">
                <span>I turn attention</span>
              </span>
              <span className="intro-mask-line">
                <span className="text-lime-accent">into impact.</span>
              </span>
            </h1>

            <p className="intro-description">
              I’m Aakash K — blending brand strategy, content, and web
              development to help people and businesses stand out.
            </p>

            <div className="intro-actions">
              <a href="#work" className="btn-primary magnetic-btn">
                <span>Explore my work</span>
                <ArrowDown size={18} weight="bold" />
              </a>

              <a href="#contact" className="btn-secondary magnetic-btn">
                <span>Let’s collaborate</span>
                <ArrowUpRight size={18} weight="bold" />
              </a>
            </div>

            <div className="intro-location-tag">
              <Compass size={16} weight="duotone" />
              <span>Based between Coimbatore &amp; Tuticorin, Tamil Nadu</span>
            </div>
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
