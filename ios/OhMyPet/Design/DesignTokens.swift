import SwiftUI

// MARK: - Color palette
//
// Editorial-light, shadcn/ui inspired: a near-monochrome neutral system on a warm
// off-white canvas, ink-black type, hairline borders, and a single restrained
// champagne accent used sparingly for active states and editorial detail.

extension Color {
    /// App background — warm off-white ("blanc cassé").
    static let canvas = Color(hex: 0xFAFAF8)
    /// Elevated surface / cards.
    static let surface = Color(hex: 0xFFFFFF)
    /// Subtle fill — inputs, muted chips, placeholders.
    static let subtle = Color(hex: 0xF4F3F0)
    /// Deeper subtle fill for hover/contrast.
    static let subtleStrong = Color(hex: 0xECEAE5)

    /// Primary text & primary buttons — warm near-black.
    static let ink = Color(hex: 0x14110D)
    /// Secondary / muted text.
    static let inkSoft = Color(hex: 0x837B70)
    /// Tertiary text & disabled.
    static let inkFaint = Color(hex: 0xB4ACA1)

    /// Hairline borders & dividers.
    static let hairline = Color(hex: 0xE7E3DC)
    /// Stronger hairline for selected outlines.
    static let hairlineStrong = Color(hex: 0xD6D0C6)

    /// The single restrained accent — champagne / soft gold.
    static let accent = Color(hex: 0xA8854F)

    init(hex: UInt, alpha: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xff) / 255,
            green: Double((hex >> 8) & 0xff) / 255,
            blue: Double(hex & 0xff) / 255,
            opacity: alpha
        )
    }
}

// MARK: - Spacing (8pt grid)

enum Sp {
    static let xxs: CGFloat = 2
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
    static let xxxl: CGFloat = 64
}

// MARK: - Corner radius (tightened — shadcn uses restrained radii)

enum Rd {
    static let xs: CGFloat = 6
    static let sm: CGFloat = 10
    static let md: CGFloat = 14
    static let lg: CGFloat = 18
    static let xl: CGFloat = 24
    static let pill: CGFloat = 999
}

// MARK: - Typography
//
// Neutral system sans (NOT rounded). Large titles lean lighter with tight
// tracking for an editorial feel; an "eyebrow" style provides upscale labels.

extension Font {
    static let display = Font.system(size: 38, weight: .semibold, design: .default)
    static let title1 = Font.system(size: 28, weight: .semibold, design: .default)
    static let title2 = Font.system(size: 21, weight: .semibold, design: .default)
    static let headline = Font.system(size: 16, weight: .semibold, design: .default)
    static let body = Font.system(size: 16, weight: .regular, design: .default)
    static let callout = Font.system(size: 14, weight: .medium, design: .default)
    static let caption = Font.system(size: 13, weight: .regular, design: .default)
    static let eyebrow = Font.system(size: 12, weight: .semibold, design: .default)
}

// MARK: - Editorial text helpers

extension View {
    /// Uppercase, tracked label used above titles ("eyebrow").
    func eyebrowStyle(_ color: Color = .accent) -> some View {
        self.font(.eyebrow)
            .tracking(2.5)
            .textCase(.uppercase)
            .foregroundStyle(color)
    }
}
