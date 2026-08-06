import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Repeat,
  GraduationCap,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Github,
  Linkedin,
  Gift,
  ShoppingBag,
  Search as SearchIcon,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import logoLight from "../assets/BookLoop_light_logo.png";
import logoDark from "../assets/BookLoop_dark_logo.png";

import MagneticButton from "../components/landing/MagneticButton";
import { Reveal, RevealGroup, RevealItem } from "../components/landing/Reveal";
import TiltCard from "../components/landing/TiltCard";
import Counter from "../components/landing/Counter";

const CATEGORIES = [
  "Fiction",
  "Sci-Fi & Fantasy",
  "Computer Science",
  "Textbooks",
  "Biography",
  "Self-Help",
  "Poetry",
  "Business",
  "History",
  "Children's",
  "Mystery",
  "Philosophy",
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Search that understands you",
    body: "Type \u201ccoding interview prep\u201d and find Introduction to Algorithms \u2014 even without a single matching word. A vector embedding pipeline reads meaning, not just keywords.",
  },
  {
    icon: MapPin,
    title: "Ranked by real distance",
    body: "Every result is sorted the moment you search, using the Haversine formula on stored coordinates \u2014 so the closest listing is always first.",
  },
  {
    icon: Repeat,
    title: "Sell it, or give it away",
    body: "List a book to sell at your price, or mark it as a donation for someone who needs it more than a few extra rupees.",
  },
  {
    icon: GraduationCap,
    title: "Built for the shelf you already have",
    body: "No warehouse, no shipping wait \u2014 just the books already sitting in your city, waiting for a second reader.",
  },
];

const STEPS = [
  {
    tag: "LIST",
    title: "Put it on the shelf",
    body: "Photograph the book, set a price or mark it as a donation, and publish in under a minute.",
  },
  {
    tag: "DISCOVER",
    title: "Search however you think",
    body: "Browse by category, search by meaning, or let distance sort nearby listings for you automatically.",
  },
  {
    tag: "MEET",
    title: "Meet, and pass it on",
    body: "Message the seller, agree on a spot nearby, and hand the book its next chapter.",
  },
];

const FAQS = [
  {
    q: "Is BookLoop free to use?",
    a: "Yes \u2014 listing a book, browsing, and messaging sellers are all free. There are no hidden fees on either side.",
  },
  {
    q: "How does the distance search actually work?",
    a: "Every listing stores a latitude and longitude. When you search nearby books, BookLoop calculates real distance using the Haversine formula and sorts results closest-first.",
  },
  {
    q: "Can I donate a book instead of selling it?",
    a: "Yes. Any listing can be marked as a donation \u2014 it shows up separately so people looking to give back can find it easily.",
  },
  {
    q: "Does search only match exact titles?",
    a: "No. Alongside regular keyword search, BookLoop runs a semantic search \u2014 your query is embedded and compared by meaning, so a description close to a book's theme still surfaces it.",
  },
];

function GlowSpot({ className }) {
  return (
    <div
      className={`lp-blob lp-aurora rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
      }}
    />
  );
}

export default function Landing() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)] font-sans">
      <LandingNav dark={dark} toggleTheme={toggleTheme} />
      <Hero dark={dark} />
      <TrustBar />
      <FeaturesSection />
      <SemanticDemoSection />
      <HowItWorksSection />
      <CategoriesMarquee />
      <BenefitsSection />
      <FounderNoteSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter dark={dark} />
    </div>
  );
}

/* ============================== NAV ============================== */

function LandingNav({ dark, toggleTheme }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-5">
        <div className="lp-glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={dark ? logoDark : logoLight}
              alt="BookLoop"
              className="h-7 w-auto"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              title={dark ? "Light mode" : "Dark mode"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] transition"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-block text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition"
            >
              Sign in
            </Link>
            <MagneticButton
              href="/signup"
              variant="primary"
              className="!px-5 !py-2.5 !text-sm"
            >
              Get started
            </MagneticButton>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================== HERO ============================== */

function Hero() {
  return (
    <section className="relative pt-40 sm:pt-48 pb-32 sm:pb-40 px-5 sm:px-8">
      {/* Aurora background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <GlowSpot className="w-[38rem] h-[38rem] -top-40 -left-40 opacity-40" />
        <GlowSpot
          className="w-[32rem] h-[32rem] top-20 -right-32 opacity-25"
          style={{ animationDelay: "-6s" }}
        />
        <div className="absolute inset-0 lp-grid-bg" />
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        {/* Copy */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent)] border border-[var(--border)] rounded-full px-3 py-1.5 lp-glass">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Catalog No. 001 &middot; Local Books
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display font-medium text-[2.75rem] sm:text-6xl lg:text-[4.2rem] leading-[1.05] tracking-tight mt-6">
              Your next book is
              <br />
              <span className="italic text-[var(--accent)]">
                closer than you think.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 text-lg text-[var(--text-muted)] max-w-lg leading-relaxed">
              Buy, sell, or donate books with people nearby &mdash; priced
              fairly, found instantly, and matched by search that understands
              what you actually mean.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <MagneticButton href="/home" variant="primary">
                Browse the shelf
                <ArrowRight size={17} />
              </MagneticButton>
              <MagneticButton href="/sell" variant="glass">
                List a book
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-6 font-mono text-xs tracking-wide text-[var(--text-muted)]">
              Free to list &middot; No platform fees &middot; Meet locally
            </p>
          </Reveal>
        </div>

        {/* Floating book stack (signature element) */}
        <div
          className="relative h-[26rem] hidden lg:block"
          style={{ perspective: 1000 }}
        >
          <FloatingBookStack />
        </div>
      </div>
    </section>
  );
}

function FloatingBookStack() {
  const cards = [
    {
      label: "SELL",
      title: "Set your price",
      icon: ShoppingBag,
      grad: "linear-gradient(155deg, var(--primary), color-mix(in srgb, var(--primary) 60%, black))",
      pos: "top-2 left-0",
      rotate: -6,
      delay: 0,
    },
    {
      label: "DISCOVER",
      title: "Search by meaning",
      icon: SearchIcon,
      grad: "linear-gradient(155deg, var(--accent), color-mix(in srgb, var(--accent) 65%, black))",
      pos: "top-24 right-0",
      rotate: 4,
      delay: 0.15,
    },
    {
      label: "DONATE",
      title: "Give it forward",
      icon: Gift,
      grad: "linear-gradient(155deg, color-mix(in srgb, var(--text-muted) 55%, var(--primary)), color-mix(in srgb, var(--primary) 75%, black))",
      pos: "bottom-0 left-10",
      rotate: -3,
      delay: 0.3,
    },
  ];

  return (
    <>
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          className={`absolute w-52 ${c.pos}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: c.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: c.delay,
            }}
            style={{ rotate: c.rotate }}
          >
            <TiltCard className="p-5">
              <div
                className="w-full h-28 rounded-xl mb-4 flex items-end p-3"
                style={{ background: c.grad }}
              >
                <c.icon size={20} className="text-white/90" />
              </div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--accent)]">
                {c.label}
              </p>
              <p className="font-display text-lg mt-1">{c.title}</p>
            </TiltCard>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}

/* ============================== TRUST BAR ============================== */

function TrustBar() {
  const items = [
    { icon: Sparkles, label: "Semantic search", sub: "Finds books by meaning" },
    { icon: MapPin, label: "Distance ranked", sub: "Haversine-based sorting" },
    {
      icon: Repeat,
      label: "Sell or donate",
      sub: "Every listing type, one place",
    },
    {
      icon: GraduationCap,
      label: "Built by a student",
      sub: "For readers like you",
    },
  ];

  return (
    <section className="border-y border-[var(--border)] py-10 px-5 sm:px-8">
      <RevealGroup className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <RevealItem key={item.label} className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--surface)] border border-[var(--border)]">
              <item.icon size={17} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {item.sub}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ============================== FEATURES ============================== */

function FeaturesSection() {
  return (
    <section className="py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          tag="Why BookLoop"
          title="Built like a library, not a warehouse."
          body="Every feature exists because a real exchange between two people nearby needed it."
        />

        <RevealGroup className="grid sm:grid-cols-2 gap-5 mt-16">
          {FEATURES.map((f) => (
            <RevealItem key={f.title}>
              <div className="h-full p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-[var(--bg)] border border-[var(--border)] group-hover:bg-[var(--accent)] transition-colors duration-300">
                  <f.icon
                    size={20}
                    className="text-[var(--accent)] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="font-display text-xl mb-2">{f.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-[15px]">
                  {f.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ============================== SEMANTIC DEMO ============================== */

function SemanticDemoSection() {
  return (
    <section className="py-24 px-5 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <GlowSpot className="w-[40rem] h-[40rem] opacity-20" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <SectionHeading
          tag="See it work"
          title="Search for the idea, not just the title."
        />

        <Reveal delay={0.15}>
          <div className="mt-14 max-w-xl mx-auto lp-glass rounded-3xl p-6 sm:p-8 text-left shadow-[0_30px_80px_-30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
              <SearchIcon
                size={16}
                className="text-[var(--text-muted)] shrink-0"
              />
              <span className="font-mono text-sm overflow-hidden whitespace-nowrap border-r-2 border-[var(--accent)] pr-1 typewriter">
                coding interview prep
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="mt-5 flex items-center gap-4 rounded-xl border border-[var(--border)] p-4"
            >
              <div
                className="w-12 h-14 rounded-md shrink-0"
                style={{
                  background:
                    "linear-gradient(155deg, var(--primary), color-mix(in srgb, var(--primary) 60%, black))",
                }}
              />
              <div className="flex-1">
                <p className="font-display text-base leading-tight">
                  Introduction to Algorithms
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Computer Science &middot; Cormen, Leiserson
                </p>
              </div>
              <span className="font-mono text-[10px] tracking-wide uppercase text-[var(--accent)] border border-[var(--accent)]/30 rounded-full px-2 py-1 shrink-0">
                matched by meaning
              </span>
            </motion.div>
          </div>
        </Reveal>

        <style>{`
          .typewriter {
            display: inline-block;
            animation: lp-type 3s steps(20, end) infinite;
          }
          @keyframes lp-type {
            0%, 8% { width: 0; }
            55%, 100% { width: 13ch; }
          }
        `}</style>
      </div>
    </section>
  );
}

/* ============================== HOW IT WORKS ============================== */

function HowItWorksSection() {
  return (
    <section className="py-28 sm:py-36 px-5 sm:px-8 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading tag="How it works" title="Three steps, no middleman." />

        <RevealGroup className="grid md:grid-cols-3 gap-6 mt-16">
          {STEPS.map((s, i) => (
            <RevealItem key={s.tag}>
              <div className="relative h-full p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg)]">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent)]">
                  {s.tag}
                </span>
                <h3 className="font-display text-2xl mt-4 mb-3">{s.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {s.body}
                </p>

                {i < STEPS.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="hidden md:block absolute top-8 -right-3 text-[var(--border)]"
                  />
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ============================== CATEGORIES MARQUEE ============================== */

function CategoriesMarquee() {
  const loop = [...CATEGORIES, ...CATEGORIES];

  return (
    <section className="py-20 overflow-hidden">
      <Reveal className="px-5 sm:px-8 max-w-6xl mx-auto mb-10">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
          Browse by category
        </p>
      </Reveal>

      <div className="flex gap-4 lp-marquee-track w-max">
        {loop.map((cat, i) => (
          <span
            key={i}
            className="shrink-0 px-6 py-3 rounded-full border border-[var(--border)] bg-[var(--surface)] font-display text-lg"
          >
            {cat}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============================== BENEFITS ============================== */

function BenefitsSection() {
  const readers = [
    "Save on textbooks and novels vs. buying new",
    "Find listings within walking distance",
    "Search however you think, not just by title",
  ];
  const sellers = [
    "List in minutes \u2014 no fees, ever",
    "Reach people nearby who actually want your books",
    "Mark any listing as a donation with one tap",
  ];

  return (
    <section className="py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        <BenefitCard
          eyebrow="For readers"
          title="Read more, spend less."
          items={readers}
          accent="var(--primary)"
        />
        <BenefitCard
          eyebrow="For sellers"
          title="Clear the shelf, help someone."
          items={sellers}
          accent="var(--accent)"
        />
      </div>
    </section>
  );
}

function BenefitCard({ eyebrow, title, items, accent }) {
  return (
    <Reveal className="h-full">
      <div className="h-full p-9 sm:p-11 rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <span
          className="font-mono text-[11px] tracking-[0.2em] uppercase"
          style={{ color: accent }}
        >
          {eyebrow}
        </span>
        <h3 className="font-display text-3xl mt-4 mb-7">{title}</h3>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: accent }}
              />
              <span className="text-[var(--text-muted)] leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ============================== FOUNDER NOTE ============================== */

function FounderNoteSection() {
  return (
    <section className="py-28 px-5 sm:px-8 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-2xl mx-auto text-center">
        <Reveal>
          <BookOpen size={28} className="mx-auto text-[var(--accent)] mb-6" />
          <p className="font-display text-2xl sm:text-3xl leading-snug">
            I built BookLoop because the books piling up on my shelf were still
            worth reading to someone else {"\u2014"} they just needed a way to
            find them.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================== FAQ ============================== */

function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          tag="Questions"
          title="Everything you'd want to know."
        />

        <div className="mt-14 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 py-6 text-left"
              >
                <span className="font-display text-lg sm:text-xl">
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[var(--text-muted)] transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-[var(--text-muted)] leading-relaxed max-w-xl">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== FINAL CTA ============================== */

function FinalCtaSection() {
  return (
    <section className="relative py-32 sm:py-44 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <GlowSpot className="w-[44rem] h-[44rem] opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <h2 className="font-display font-medium text-4xl sm:text-6xl leading-[1.1]">
            Give your books
            <br />
            <span className="italic text-[var(--accent)]">
              a second reader.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex justify-center">
            <MagneticButton
              href="/signup"
              variant="primary"
              className="!px-9 !py-4 !text-base"
            >
              Get started, it's free
              <ArrowRight size={18} />
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================== FOOTER ============================== */

function LandingFooter({ dark }) {
  return (
    <footer className="border-t border-[var(--border)] py-14 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-8">
        <div>
          <img
            src={dark ? logoDark : logoLight}
            alt="BookLoop"
            className="h-7 w-auto mb-4"
          />
          <p className="text-sm text-[var(--text-muted)] max-w-xs">
            A hyperlocal marketplace to buy, sell, and donate books &mdash;
            built with React, Express, MongoDB, and a Pinecone-powered semantic
            search service.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/home"
                  className="hover:text-[var(--accent)] transition"
                >
                  Browse books
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-[var(--accent)] transition"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="hover:text-[var(--accent)] transition"
                >
                  Sell a book
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-4">
              Creator
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/chaitanya-173"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--accent)] transition"
                >
                  <Github size={15} /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/chaitanya-chaudhary-675343360"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--accent)] transition"
                >
                  <Linkedin size={15} /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[var(--border)] font-mono text-xs text-[var(--text-muted)]">
        © {new Date().getFullYear()} BookLoop. Built by Chaitanya Chaudhary.
      </div>
    </footer>
  );
}

/* ============================== SHARED HEADING ============================== */

function SectionHeading({ tag, title, body }) {
  return (
    <Reveal className="max-w-2xl">
      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)]">
        {tag}
      </span>
      <h2 className="font-display font-medium text-3xl sm:text-[2.6rem] leading-[1.15] mt-4">
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-[var(--text-muted)] text-lg leading-relaxed">
          {body}
        </p>
      )}
    </Reveal>
  );
}
