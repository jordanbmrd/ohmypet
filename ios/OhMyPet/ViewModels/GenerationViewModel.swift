import SwiftUI

@MainActor
final class GenerationViewModel: ObservableObject {
    enum Phase: Equatable {
        case running
        case completed(GenerationJob)
        case failed(String)
    }

    @Published var phase: Phase = .running
    @Published var progress: Double = 0.0
    @Published var statusMessage = "Préparation de la photo…"

    let pet: Pet
    let theme: PosterTheme
    private let service: GenerationService
    private var task: Task<Void, Never>?
    private var tickTask: Task<Void, Never>?

    private let messages = [
        "Préparation de la photo…",
        "Étude de votre compagnon…",
        "Composition du thème…",
        "Touche finale de l'artiste…",
    ]

    init(service: GenerationService, pet: Pet, theme: PosterTheme) {
        self.service = service
        self.pet = pet
        self.theme = theme
    }

    func start() {
        guard task == nil else { return }
        startFakeProgress()
        task = Task {
            do {
                let job = try await service.generate(pet: pet, theme: theme)
                await MainActor.run { self.finish(.completed(job)) }
            } catch {
                let message = (error as? LocalizedError)?.errorDescription
                    ?? "La création a échoué. Réessayez."
                await MainActor.run { self.finish(.failed(message)) }
            }
        }
    }

    func cancel() {
        task?.cancel()
        tickTask?.cancel()
        task = nil
        tickTask = nil
    }

    private func finish(_ phase: Phase) {
        tickTask?.cancel()
        withAnimation(Anim.smooth) {
            progress = 1.0
            self.phase = phase
        }
    }

    /// Drives the indeterminate progress bar + rotating status copy (~25s budget).
    private func startFakeProgress() {
        tickTask = Task {
            let steps = 90
            for i in 0..<steps {
                if Task.isCancelled { return }
                try? await Task.sleep(for: .milliseconds(280))
                await MainActor.run {
                    // Ease toward 0.92 so we never "complete" before the real result.
                    let t = Double(i) / Double(steps)
                    self.progress = min(0.92, t * 0.92)
                    let idx = min(self.messages.count - 1, Int(t * Double(self.messages.count)))
                    self.statusMessage = self.messages[idx]
                }
            }
        }
    }
}
