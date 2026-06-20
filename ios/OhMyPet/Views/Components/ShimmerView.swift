import SwiftUI

/// Animated loading placeholder in neutral tones.
struct ShimmerView: View {
    @State private var phase: CGFloat = -1

    var body: some View {
        GeometryReader { geo in
            LinearGradient(
                colors: [
                    .subtle,
                    .subtleStrong,
                    .subtle,
                ],
                startPoint: .leading,
                endPoint: .trailing
            )
            .offset(x: phase * geo.size.width)
            .onAppear {
                withAnimation(.linear(duration: 1.4).repeatForever(autoreverses: false)) {
                    phase = 1
                }
            }
        }
        .background(Color.subtle)
    }
}

struct ShimmerModifier: ViewModifier {
    var active: Bool
    func body(content: Content) -> some View {
        content.overlay {
            if active {
                ShimmerView().allowsHitTesting(false)
            }
        }
    }
}

extension View {
    func shimmering(_ active: Bool = true) -> some View {
        modifier(ShimmerModifier(active: active))
    }
}
