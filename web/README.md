# OhMyPet — Site web

Site OhMyPet : landing marketing + parcours de commande complet. Vite + React + TypeScript, Tailwind CSS v4, composants façon shadcn/ui, animations Framer Motion.

## Démarrage

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
```

## Direction artistique

Éditorial / galerie d'art, haut de gamme — cohérent avec l'app iOS :

- **Typographie** : Fraunces (serif à contraste, titres) + Hanken Grotesk (corps)
- **Palette** : canvas blanc cassé chaud, encre presque noire, accent champagne unique, filets hairline
- **Détails** : grain fin, révélations au scroll discrètes, posters encadrés en CSS
- **Ton** : vouvoiement, labels « eyebrow », pas de couleurs criardes ni d'animations rebondissantes

Les 5 thèmes et leurs accents désaturés reprennent `PosterTheme` de l'app iOS.

## Pages

| Route | Rôle |
|-------|------|
| `/` | Landing (`Hero · Marquee · HowItWorks · Themes · Products · Testimonials · FAQ · CTA`) |
| `/creer` | Atelier : photo → thème → génération IA → choix du support. Accepte `?theme=` et `?produit=` |
| `/panier` | Panier (localStorage) et départ vers le paiement Stripe |
| `/commande/confirmation?order=` | Retour de Stripe, suivi du statut de la commande |
| `/cgv`, `/mentions-legales`, `/confidentialite` | Pages légales (compléter les champs `[entre crochets]`) |

- Contenu marketing : `src/lib/content.ts`
- Catalogue et prix affichés : `src/lib/catalog.ts` (copie de `backend/src/lib/catalog.ts`, qui fait foi au paiement)
- Client API : `src/lib/api.ts` · Panier : `src/lib/cart.tsx`

## Configuration

```bash
VITE_API_BASE_URL=https://xxxx.execute-api.eu-west-3.amazonaws.com/dev npm run dev
```

Sans `VITE_API_BASE_URL`, le site tourne en **mode démo** : la génération renvoie l'exemple du
thème choisi et le paiement est désactivé. En production, la variable de dépôt GitHub
`API_BASE_URL` est injectée au build (workflow `deploy-pages.yml`).

Le routage utilise l'historique du navigateur ; `npm run build` copie `index.html` en `404.html`
pour que GitHub Pages serve l'app sur les URL profondes (retour Stripe, rafraîchissement).
