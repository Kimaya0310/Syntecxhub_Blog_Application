const Footer = () => (
  <footer className="border-t border-ink/10 mt-20">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-display text-lg font-semibold">Marginalia</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
        Built with the MERN stack · {new Date().getFullYear()}
      </span>
    </div>
  </footer>
);

export default Footer;
