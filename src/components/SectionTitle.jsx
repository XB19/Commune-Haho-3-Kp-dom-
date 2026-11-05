export default function SectionTitle({ eyebrow, title, center = false, light = false, className = "" }) {
  return (
    <div data-reveal="up" className={`${center ? "text-center mx-auto" : ""} ${className}`}>
      {eyebrow && (
        <span
          className={`font-display text-xs font-bold uppercase tracking-[0.25em] ${
            light ? "text-gold-light" : "text-crimson"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-3 text-3xl md:text-[42px] font-bold leading-tight tracking-tight text-balance ${
          light ? "text-white" : "text-gold"
        }`}
      >
        {title}
      </h2>
      <span className={`title-bar block h-1 w-16 bg-gold mt-5 ${center ? "mx-auto" : ""}`} />
    </div>
  );
}
