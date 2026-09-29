import { Link } from "react-router-dom";

/**
 * Legal pages. Text in [brackets] must be completed with the company's details
 * before going live (legal entity, SIREN, address, host, contact email).
 */

type Section = { id?: string; title: string; body: string[] };
type Page = { eyebrow: string; title: string; accent: string; sections: Section[] };

const CONTACT = "[contact@ohmypet.fr]";

const pages: Record<"cgv" | "mentions" | "confidentialite", Page> = {
  cgv: {
    eyebrow: "Légal",
    title: "Conditions générales",
    accent: "de vente.",
    sections: [
      {
        title: "1. Objet",
        body: [
          "Les présentes conditions régissent les ventes conclues sur le site OhMyPet entre [Raison sociale], ci-après « OhMyPet », et toute personne physique agissant en qualité de consommateur, ci-après « le Client ».",
          "OhMyPet propose la création de portraits d'animaux de compagnie générés par intelligence artificielle à partir d'une photo fournie par le Client, et leur impression sur différents supports (tirage encadré, tasse, coque de téléphone).",
        ],
      },
      {
        title: "2. Commande",
        body: [
          "Le Client crée son portrait, choisit un support et ses options, puis valide son panier. La commande est ferme après validation du paiement. Un récapitulatif est affiché à l'issue du paiement et un reçu est adressé par email.",
          "Le Client garantit disposer des droits sur la photo transmise et s'interdit toute image portant atteinte aux droits de tiers.",
        ],
      },
      {
        title: "3. Prix et paiement",
        body: [
          "Les prix sont indiqués en euros toutes taxes comprises. Les frais de livraison sont précisés avant la validation de la commande ; la livraison est offerte à partir du seuil affiché sur le site.",
          "Le paiement est exigible immédiatement et s'effectue par carte bancaire, Apple Pay ou Google Pay via notre prestataire sécurisé Stripe. OhMyPet n'a jamais accès aux données de carte du Client.",
        ],
      },
      {
        id: "livraison",
        title: "4. Fabrication et livraison",
        body: [
          "Chaque article est fabriqué à la commande par nos partenaires d'impression puis expédié sous 2 à 4 jours ouvrés. Le délai de livraison indicatif est de 4 à 8 jours ouvrés après la commande.",
          "Les livraisons sont assurées en France métropolitaine, en Belgique, en Suisse, au Luxembourg et à Monaco, à l'adresse indiquée lors du paiement.",
        ],
      },
      {
        id: "retractation",
        title: "5. Droit de rétractation",
        body: [
          "Conformément à l'article L221-28, 3° du Code de la consommation, le droit de rétractation ne peut être exercé pour les biens confectionnés selon les spécifications du consommateur ou nettement personnalisés. Les articles OhMyPet, imprimés avec le portrait de votre animal, entrent dans cette catégorie.",
        ],
      },
      {
        title: "6. Conformité et réclamations",
        body: [
          `Si un article arrive endommagé ou présente un défaut d'impression, le Client nous contacte à ${CONTACT} dans les 14 jours suivant la réception, photos à l'appui. Après vérification, l'article est réimprimé ou remboursé, sans frais.`,
          "Le Client bénéficie en outre de la garantie légale de conformité (articles L217-3 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil).",
        ],
      },
      {
        title: "7. Portraits générés",
        body: [
          "Les portraits sont produits par un modèle d'intelligence artificielle ; chaque création est unique et peut présenter des interprétations artistiques. Le Client visualise le portrait avant de commander et peut en générer de nouvelles versions.",
          "Le Client peut utiliser librement son portrait à des fins personnelles.",
        ],
      },
      {
        title: "8. Médiation et litiges",
        body: [
          "En cas de litige, le Client peut recourir gratuitement au médiateur de la consommation : [nom et coordonnées du médiateur]. Les présentes conditions sont soumises au droit français.",
        ],
      },
    ],
  },
  mentions: {
    eyebrow: "Légal",
    title: "Mentions",
    accent: "légales.",
    sections: [
      {
        title: "Éditeur",
        body: [
          "[Raison sociale], [forme juridique] au capital de [montant] €, immatriculée au RCS de [ville] sous le numéro [SIREN], dont le siège est situé [adresse].",
          `Directeur de la publication : [nom]. Contact : ${CONTACT}.`,
          "TVA intracommunautaire : [numéro].",
        ],
      },
      {
        title: "Hébergement",
        body: [
          "Site : GitHub Pages, GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis.",
          "Services applicatifs et stockage : Amazon Web Services EMEA SARL, 38 avenue John F. Kennedy, L-1855 Luxembourg.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        body: [
          "L'ensemble des éléments du site (textes, visuels, marque OhMyPet) est protégé. Toute reproduction sans autorisation préalable est interdite.",
        ],
      },
    ],
  },
  confidentialite: {
    eyebrow: "Légal",
    title: "Politique de",
    accent: "confidentialité.",
    sections: [
      {
        title: "Données collectées",
        body: [
          "La photo de votre animal, transmise pour créer le portrait. Lors d'une commande : votre nom, email, téléphone et adresse de livraison, collectés par Stripe au moment du paiement.",
          "Aucun compte n'est nécessaire. Votre panier est conservé uniquement dans votre navigateur.",
        ],
      },
      {
        title: "Finalités et bases légales",
        body: [
          "Créer votre portrait et exécuter votre commande (exécution du contrat), respecter nos obligations comptables et fiscales (obligation légale).",
        ],
      },
      {
        title: "Durées de conservation",
        body: [
          "Les photos envoyées sont supprimées automatiquement sous 7 jours. Les portraits non commandés ne sont plus accessibles au-delà de 7 jours. Les données de commande sont conservées 10 ans au titre des obligations comptables.",
        ],
      },
      {
        title: "Destinataires",
        body: [
          "Nos sous-traitants, dans la limite de leur mission : Amazon Web Services (hébergement), OpenAI (génération des portraits), Stripe (paiement), nos partenaires d'impression et transporteurs (fabrication et livraison). Certains sont situés hors de l'Union européenne et encadrés par des clauses contractuelles types.",
        ],
      },
      {
        title: "Vos droits",
        body: [
          `Vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Écrivez-nous à ${CONTACT}. Vous pouvez également saisir la CNIL (cnil.fr).`,
          "Le site n'utilise aucun cookie publicitaire ni traceur de mesure d'audience.",
        ],
      },
    ],
  },
};

export function Legal({ page }: { page: keyof typeof pages }) {
  const p = pages[page];
  return (
    <article className="mx-auto max-w-3xl px-6 pb-28 pt-32 lg:pt-40">
      <p className="eyebrow mb-5">{p.eyebrow}</p>
      <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">
        {p.title} <span className="italic text-accent">{p.accent}</span>
      </h1>
      <div className="mt-14 border-t border-hairline">
        {p.sections.map((s) => (
          <section key={s.title} id={s.id} className="scroll-mt-28 border-b border-hairline py-8">
            <h2 className="text-lg font-medium">{s.title}</h2>
            {s.body.map((para) => (
              <p key={para} className="mt-3 leading-relaxed text-ink-soft">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm text-ink-faint">
        Une question ? <Link to="/#faq" className="underline underline-offset-2 hover:text-ink">Consultez la FAQ</Link>{" "}
        ou écrivez-nous à {CONTACT}.
      </p>
    </article>
  );
}
