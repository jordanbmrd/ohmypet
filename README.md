# OhMyPet 🐾

Transforme une photo de ton animal de compagnie (chien ou chat) en poster artistique généré par IA — couverture de magazine, portrait royal, superhéros, et plus — puis commande-le imprimé dans un cadre, sur une tasse ou une coque de téléphone, livré chez toi.

## Stack

| Couche | Techno |
|--------|--------|
| App | iOS · SwiftUI · XcodeGen |
| Backend | AWS SAM · Lambda · API Gateway · DynamoDB · S3 |
| IA image | AWS Bedrock — Amazon Nova Canvas (`IMAGE_VARIATION`) |
| E-commerce | Shopify Storefront API (GraphQL) |
| Print on demand | Prodigi / Printful |

## Monorepo

```
ohmypet/
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
- **Phase 3 — Commande Shopify** : panier, checkout, fulfillment print
- **Phase 4 — App Store** : polish, privacy, TestFlight
