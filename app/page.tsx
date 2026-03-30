'use client';

import { motion } from 'framer-motion';

const featuredProjects = [
  {
    title: 'Cirque du Soleil — Digital Platform',
    category: 'Brand Platform / Experience Design',
    summary: 'Immersive storytelling and performant content architecture for a global entertainment brand.'
  },
  {
    title: 'BRP — Commerce Ecosystem',
    category: 'Product Design / Engineering',
    summary: 'Unified purchasing journeys across products, dealers, and support surfaces.'
  },
  {
    title: 'Aldo — Omnichannel UX',
    category: 'Research / UX Strategy',
    summary: 'Data-informed redesign focused on conversion, speed, and editorial flexibility.'
  },
  {
    title: 'National Bank — Service Experience',
    category: 'Design Systems / Accessibility',
    summary: 'Robust interface system enabling cross-team consistency and velocity.'
  }
];

const services = [
  'Digital strategy',
  'Brand and visual systems',
  'UX/UI design',
  'Frontend engineering',
  'CMS architecture',
  'Performance optimization'
];

const insights = [
  {
    title: 'Designing for long-term product velocity',
    date: 'March 2026'
  },
  {
    title: 'Why intentional motion improves comprehension',
    date: 'February 2026'
  },
  {
    title: 'Building resilient design systems across teams',
    date: 'January 2026'
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#ece8df] text-[#141414]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#ece8df]/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <span className="text-xl font-semibold tracking-tight">Locomotive</span>
          <ul className="flex items-center gap-5 text-sm text-black/70 md:gap-8">
            {['Work', 'Services', 'Agency', 'Journal', 'Contact'].map((item) => (
              <li key={item} className="cursor-pointer transition hover:text-black">
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-20 pt-16 md:grid-cols-[1.45fr_1fr] md:px-8 md:pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-5xl font-semibold leading-[1.02] tracking-tight md:text-8xl"
        >
          A digital product and design agency crafting bold, enduring experiences.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="self-end text-base leading-relaxed text-black/70"
        >
          We partner with ambitious organizations to design, build, and scale digital products that feel sharp, performant,
          and unmistakably human.
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-medium md:text-4xl">Featured Work</h2>
          <span className="text-sm text-black/60">Selected projects</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, idx) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-black/10 bg-white/70 p-6"
            >
              <div className="mb-8 h-44 rounded-2xl bg-[linear-gradient(140deg,#c9c2b5,#d7e1d7)]" />
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-black/55">{project.category}</p>
              <h3 className="mb-2 text-2xl font-medium tracking-tight">{project.title}</h3>
              <p className="text-black/65">{project.summary}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#e5e0d6]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">Services</h2>
            <p className="mt-4 max-w-md text-black/70">From product strategy to engineering, we build systems that ship quickly and scale elegantly.</p>
          </div>
          <ul className="grid gap-3 text-lg md:grid-cols-2">
            {services.map((service) => (
              <li key={service} className="rounded-xl border border-black/10 bg-white/40 px-4 py-3">
                {service}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.2fr] md:px-8">
        <h2 className="text-3xl font-medium tracking-tight md:text-5xl">Agency</h2>
        <div className="space-y-6 text-black/75">
          <p>
            We are a multidisciplinary team of strategists, designers, and developers creating digital experiences for culture, commerce, and technology.
          </p>
          <p>
            Our process combines deep collaboration, rigorous craft, and measurable outcomes — without sacrificing visual personality.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-medium md:text-4xl">Journal</h2>
          <span className="text-sm text-black/60">Latest insights</span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {insights.map((post) => (
            <article key={post.title} className="rounded-2xl border border-black/10 bg-white/70 p-5 transition hover:bg-white">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-black/50">{post.date}</p>
              <h3 className="text-lg font-medium">{post.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-black/10 bg-[#141414] text-[#f2efe8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="text-2xl font-medium tracking-tight">Let’s build what’s next.</p>
            <p className="mt-2 text-sm text-white/70">hello@locomotive.ca</p>
          </div>
          <p className="text-sm text-white/55">© 2026 Locomotive (clone exercise)</p>
        </div>
      </footer>
    </main>
  );
}
