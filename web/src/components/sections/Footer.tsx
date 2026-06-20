export function Footer() {
  const cols = [
    {
      title: "Atelier",
      links: ["Thèmes", "Comment ça marche", "Tirages", "Tarifs"],
    },
    {
      title: "Maison",
      links: ["À propos", "Journal", "Presse", "Contact"],
    },
    {
      title: "Légal",
      links: ["Confidentialité", "Conditions", "Cookies"],
    },
  ];

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <img src="/paw.svg" alt="" className="h-4 w-4" />
              <span className="text-[0.95rem] font-semibold tracking-[0.04em]">
                OhMyPet
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              L'atelier qui transforme votre compagnon en œuvre d'art, puis
              l'imprime et l'encadre pour vous.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="eyebrow mb-5">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 text-sm text-ink-faint sm:flex-row">
          <span>© {new Date().getFullYear()} OhMyPet. Tous droits réservés.</span>
          <span className="display italic">Fait avec soin pour vos compagnons.</span>
        </div>
      </div>
    </footer>
  );
}
