import SwiftUI

/// Poster themes — keys MUST match the backend `THEMES` in promptBuilder.ts.
enum PosterTheme: String, CaseIterable, Identifiable, Hashable {
    case magazineCover = "magazine_cover"
    case royaltyPortrait = "royalty_portrait"
    case superhero = "superhero"
    case spaceExplorer = "space_explorer"
    case chef = "chef"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .magazineCover: "Couverture Magazine"
        case .royaltyPortrait: "Portrait Royal"
        case .superhero: "Superhéros"
        case .spaceExplorer: "Explorateur Spatial"
        case .chef: "Grand Chef"
        }
    }

    var subtitle: String {
        switch self {
        case .magazineCover: "Star de la mode"
        case .royaltyPortrait: "Majesté à fourrure"
        case .superhero: "Sauveur du quartier"
        case .spaceExplorer: "Au-delà des étoiles"
        case .chef: "Étoilé au guide"
        }
    }

    /// Bundled example render for this theme (imageset `theme_<rawValue>`).
    var previewAssetName: String { "theme_\(rawValue)" }

    /// SF Symbol used as a stand-in until theme artwork is added.
    var symbol: String {
        switch self {
        case .magazineCover: "camera.macro"
        case .royaltyPortrait: "crown.fill"
        case .superhero: "bolt.fill"
        case .spaceExplorer: "moon.stars.fill"
        case .chef: "fork.knife"
        }
    }

    /// Muted, sophisticated tone used for subtle accents (not loud fills).
    var accent: Color {
        switch self {
        case .magazineCover: Color(hex: 0x9E6B72)   // dusty rose
        case .royaltyPortrait: Color(hex: 0x6B6585) // muted aubergine
        case .superhero: Color(hex: 0xA8854F)       // champagne
        case .spaceExplorer: Color(hex: 0x4F6173)   // slate blue
        case .chef: Color(hex: 0x9A5F4E)            // terracotta
        }
    }
}
