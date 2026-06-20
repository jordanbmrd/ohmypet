# OhMyPet — Landing

Landing page marketing pour OhMyPet. Vite + React + TypeScript, Tailwind CSS v4, composants façon shadcn/ui, animations Framer Motion.

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

## Structure

`Nav · Hero · Marquee · HowItWorks · Themes · Products · Testimonials · FAQ · CTA · Footer`

Contenu centralisé dans `src/lib/content.ts`.
