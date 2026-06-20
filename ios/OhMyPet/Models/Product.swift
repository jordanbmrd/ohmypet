import SwiftUI

// MARK: - Product catalogue
//
// The three made-to-order objects the generated portrait can be printed on.
// Pricing is held in integer cents to avoid floating-point drift. Each product
// carries a `ProductMockup` describing how/where the portrait is composited onto
// a SwiftUI stand-in object (upgradable to a photoreal PNG later — see ProductMockupView).

enum ProductCategory: String, CaseIterable, Identifiable, Hashable {
    case frame
    case mug
    case phoneCase

    var id: String { rawValue }

    var title: String {
        switch self {
        case .frame: "Cadre encadré"
        case .mug: "Tasse"
        case .phoneCase: "Coque iPhone"
        }
    }

    var subtitle: String {
        switch self {
        case .frame: "Tirage signé, encadré main"
        case .mug: "Céramique, 330 ml"
        case .phoneCase: "Finition mate premium"
        }
    }

    var blurb: String {
        switch self {
        case .frame:
            "Un tirage giclée sur papier d'art, encadré à la main dans un cadre fin. Livré prêt à accrocher."
        case .mug:
            "Une tasse en céramique passée au four, votre portrait imprimé tout autour. Lavable au lave-vaisselle."
        case .phoneCase:
            "Une coque rigide à finition mate, votre compagnon imprimé sur toute la surface. Découpe précise."
        }
    }

    /// SF Symbol used for compact contexts (cart rows, fallbacks).
    var symbol: String {
        switch self {
        case .frame: "photo.artframe"
        case .mug: "cup.and.saucer.fill"
        case .phoneCase: "iphone"
        }
    }

    var basePriceCents: Int {
        switch self {
        case .frame: 4900
        case .mug: 2400
        case .phoneCase: 2900
        }
    }

    /// Label shown above the variant chips on the product detail screen.
    var variantLabel: String {
        switch self {
        case .frame: "Format"
        case .mug: "Couleur"
        case .phoneCase: "Modèle"
        }
    }

    var variants: [ProductVariant] {
        switch self {
        case .frame:
            [
                ProductVariant(id: "frame-20x30", label: "20 × 30 cm", priceDeltaCents: 0),
                ProductVariant(id: "frame-30x40", label: "30 × 40 cm", priceDeltaCents: 2000),
                ProductVariant(id: "frame-40x50", label: "40 × 50 cm", priceDeltaCents: 4000),
            ]
        case .mug:
            [
                ProductVariant(id: "mug-white", label: "Blanc", priceDeltaCents: 0),
                ProductVariant(id: "mug-black", label: "Noir", priceDeltaCents: 300),
            ]
        case .phoneCase:
            [
                ProductVariant(id: "case-15", label: "iPhone 15", priceDeltaCents: 0),
                ProductVariant(id: "case-15-pro", label: "iPhone 15 Pro", priceDeltaCents: 0),
                ProductVariant(id: "case-16", label: "iPhone 16", priceDeltaCents: 0),
                ProductVariant(id: "case-16-pro", label: "iPhone 16 Pro", priceDeltaCents: 0),
            ]
        }
    }

    var mockup: ProductMockup {
        switch self {
        // `printRect` is the portrait's normalised slot (0…1) inside the object.
        case .frame:
            ProductMockup(assetName: "mockup_frame",
                          printRect: CGRect(x: 0.12, y: 0.10, width: 0.76, height: 0.80),
                          cornerRadius: 2, rotationDegrees: 0, artOpacity: 1.0)
        case .mug:
            ProductMockup(assetName: "mockup_mug",
                          printRect: CGRect(x: 0.30, y: 0.34, width: 0.42, height: 0.40),
                          cornerRadius: 6, rotationDegrees: 0, artOpacity: 0.96)
        case .phoneCase:
            ProductMockup(assetName: "mockup_case",
                          printRect: CGRect(x: 0.16, y: 0.07, width: 0.68, height: 0.86),
                          cornerRadius: 28, rotationDegrees: 0, artOpacity: 1.0)
        }
    }
}

// MARK: - Variant

/// A purchasable option of a product. `shopifyVariantId` is the anchor point for
/// the future Shopify Storefront integration (maps to a variant GID); nil for now.
struct ProductVariant: Identifiable, Hashable {
    let id: String
    let label: String
    let priceDeltaCents: Int
    var shopifyVariantId: String? = nil
}

// MARK: - Mockup configuration

/// Describes how the generated portrait is composited onto a product. `assetName`
/// points to an optional photoreal PNG in the asset catalogue; when absent,
/// ProductMockupView draws a SwiftUI stand-in object instead.
struct ProductMockup: Hashable {
    let assetName: String
    /// Portrait slot in normalised coordinates (0…1) within the object's frame.
    let printRect: CGRect
    let cornerRadius: CGFloat
    let rotationDegrees: Double
    let artOpacity: Double
}

// MARK: - Price formatting

/// Formats integer cents as a French price, e.g. 2400 → "24 €".
func formattedPrice(cents: Int) -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .currency
    formatter.currencyCode = "EUR"
    formatter.locale = Locale(identifier: "fr_FR")
    formatter.maximumFractionDigits = cents % 100 == 0 ? 0 : 2
    return formatter.string(from: NSNumber(value: Double(cents) / 100)) ?? "\(cents / 100) €"
}
