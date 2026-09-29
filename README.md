# OhMyPet 🐾

Transforme une photo de ton animal de compagnie (chien ou chat) en poster artistique généré par IA — couverture de magazine, portrait royal, superhéros, et plus — puis commande-le imprimé dans un cadre, sur une tasse ou une coque de téléphone, livré chez toi.

## Stack

| Couche | Techno |
|--------|--------|
| Site web | React · Vite · Tailwind (GitHub Pages) |
| App | iOS · SwiftUI · XcodeGen |
| Backend | AWS SAM · Lambda · API Gateway · DynamoDB · S3 |
| IA image | AWS Bedrock — Amazon Nova Canvas (`IMAGE_VARIATION`) |
| Paiement | Stripe Checkout (hébergé) + webhook |
| Print on demand | Prodigi / Printful |

## Monorepo

```
ohmypet/
├── web/        # Site : landing + atelier + panier + paiement
├── ios/        # App SwiftUI
├── backend/    # AWS SAM (TypeScript Lambdas)
└── docs/       # Architecture, setup Shopify, contrat API
```

## Démarrage

### Backend

```bash
cd backend
npm install
npm run build
sam build
sam deploy --guided   # première fois
```

Récupère l'URL de l'API Gateway dans les outputs, puis renseigne-la dans la config iOS.

### Paiement (Stripe)

1. Après `sam deploy`, renseignez les clés Stripe (mode test d'abord) :
   ```bash
   aws secretsmanager put-secret-value --secret-id ohmypet/stripe-dev \
     --secret-string '{"secretKey":"sk_test_...","webhookSecret":"whsec_..."}'
   ```
2. Dans le dashboard Stripe → Développeurs → Webhooks, ajoutez l'URL de l'output `StripeWebhookUrl`
   avec les événements `checkout.session.completed`, `checkout.session.async_payment_succeeded`
   et `checkout.session.expired` ; son secret de signature est le `webhookSecret` ci-dessus.
3. Activez les reçus par email (Paramètres → Emails clients → Paiements réussis).
4. Le paramètre SAM `SiteUrl` (défaut `https://jordanbmrd.github.io/ohmypet`) est l'URL de retour après paiement.

Les prix sont recalculés côté serveur (`backend/src/lib/catalog.ts`) ; le client n'envoie que
produit, options, quantité et `jobId`. Les commandes payées sont dans la table
`ohmypet-orders-<stage>` (adresse, email, articles, clé S3 du portrait à imprimer). L'envoi à
l'imprimeur (Prodigi / Printful) reste à brancher.

### Site web

```bash
cd web
npm install
VITE_API_BASE_URL=<ApiBaseUrl> npm run dev
```

Pour la mise en ligne, définissez la variable de dépôt GitHub `API_BASE_URL` (Settings → Secrets and
variables → Actions → Variables) ; sans elle, le site est publié en mode démo.

### iOS

```bash
cd ios
brew install xcodegen   # si pas installé
xcodegen generate
open OhMyPet.xcodeproj
```

Copie `OhMyPet/Config/Secrets.example.plist` vers `Secrets.plist` et renseigne `ApiBaseURL` (+ plus tard les clés Shopify).

## Roadmap

- **Phase 1 — MVP** : photo → génération IA → aperçu poster ✅ (en cours)
- **Phase 2 — Affinement IA** : 10 thèmes, retry, validation Rekognition, CloudFront
- **Phase 3 — Commande** : site web + paiement Stripe ✅ · fulfillment print (Prodigi / Printful) · checkout iOS
- **Phase 4 — App Store** : polish, privacy, TestFlight
