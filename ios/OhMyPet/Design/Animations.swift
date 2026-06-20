import SwiftUI

enum Anim {
    /// Default UI motion — calm, precise.
    static let spring = Animation.spring(response: 0.4, dampingFraction: 0.86)
    /// Slightly looser for larger elements.
    static let soft = Animation.spring(response: 0.5, dampingFraction: 0.9)
    static let smooth = Animation.easeInOut(duration: 0.28)
}

extension AnyTransition {
    /// Editorial screen transition: a restrained rise + fade.
    static var rise: AnyTransition {
        .asymmetric(
            insertion: .move(edge: .bottom).combined(with: .opacity),
            removal: .opacity
        )
    }
}
