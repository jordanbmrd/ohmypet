import SwiftUI

// MARK: - Card surface (hairline border + whisper shadow — shadcn style)

struct CardSurface: ViewModifier {
    var radius: CGFloat = Rd.lg
    var bordered: Bool = true
    func body(content: Content) -> some View {
        content
            .background(Color.surface)
            .clipShape(RoundedRectangle(cornerRadius: radius, style: .continuous))
            .overlay {
                if bordered {
                    RoundedRectangle(cornerRadius: radius, style: .continuous)
                        .strokeBorder(Color.hairline, lineWidth: 1)
                }
            }
            .shadow(color: .ink.opacity(0.04), radius: 12, x: 0, y: 6)
    }
}

extension View {
    func cardSurface(radius: CGFloat = Rd.lg, bordered: Bool = true) -> some View {
        modifier(CardSurface(radius: radius, bordered: bordered))
    }

    /// Hairline border around any shape-clipped content.
    func hairlineBorder(_ radius: CGFloat = Rd.md, color: Color = .hairline, width: CGFloat = 1) -> some View {
        overlay {
            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .strokeBorder(color, lineWidth: width)
        }
    }
}

// MARK: - Press feedback (subtle — refined, not bouncy)

struct PressScaleStyle: ButtonStyle {
    var scale: CGFloat = 0.98
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .opacity(configuration.isPressed ? 0.9 : 1.0)
            .scaleEffect(configuration.isPressed ? scale : 1.0)
            .animation(.spring(response: 0.28, dampingFraction: 0.82), value: configuration.isPressed)
    }
}
