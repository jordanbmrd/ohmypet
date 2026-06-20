import SwiftUI

/// Lightweight global state: onboarding gate and shared service singletons.
@MainActor
final class AppState: ObservableObject {
    @AppStorage("hasSeenOnboarding") var hasSeenOnboarding: Bool = false

    let generationService: GenerationService

    init(generationService: GenerationService = GenerationService()) {
        self.generationService = generationService
    }
}
