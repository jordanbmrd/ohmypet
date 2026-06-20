const words = [
  "Couverture Magazine",
  "Portrait Royal",
  "Superhéros",
  "Explorateur Spatial",
  "Grand Chef",
];

export function Marquee() {
  const row = [...words, ...words, ...words];
  return (
    <section className="mt-28 border-y border-hairline py-6 lg:mt-40">
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {row.map((w, i) => (
            <span key={i} className="flex items-center">
              <span className="display px-8 text-2xl text-ink/70 italic">{w}</span>
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
