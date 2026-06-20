import SwiftUI

struct GenerationLoadingView: View {
    @StateObject var vm: GenerationViewModel
    @EnvironmentObject private var router: AppRouter

    var body: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()

            switch vm.phase {
            case .running:
                runningState
            case let .failed(message):
                ErrorStateView(message: message) {
                    router.pop()
                }
            case .completed:
                // Navigates away in onChange; show running visuals meanwhile.
                runningState
            }
        }
        .navigationBarBackButtonHidden(true)
        .onAppear { vm.start() }
        .onDisappear { vm.cancel() }
        .onChange(of: vm.phase) { _, phase in
            if case let .completed(job) = phase {
                router.path.removeLast()
                router.push(.result(job: job, theme: vm.theme))
            }
        }
    }

    private var runningState: some View {
        VStack(spacing: Sp.xl) {
            Spacer()

            ZStack {
                Circle()
                    .stroke(Color.hairline, lineWidth: 2)
                    .frame(width: 132, height: 132)
                Circle()
                    .trim(from: 0, to: vm.progress)
                    .stroke(Color.ink, style: StrokeStyle(lineWidth: 2, lineCap: .round))
                    .frame(width: 132, height: 132)
                    .rotationEffect(.degrees(-90))
                    .animation(Anim.smooth, value: vm.progress)
                Image(systemName: vm.theme.symbol)
                    .font(.system(size: 34, weight: .light))
                    .foregroundStyle(vm.theme.accent)
            }

            VStack(spacing: Sp.sm) {
                Text("Création en cours")
                    .eyebrowStyle()
                Text(vm.theme.title)
                    .font(.title2)
                    .foregroundStyle(Color.ink)
                Text(vm.statusMessage)
                    .font(.callout)
                    .foregroundStyle(Color.inkSoft)
                    .transition(.opacity)
                    .id(vm.statusMessage)
                    .animation(Anim.smooth, value: vm.statusMessage)
            }

            Spacer()
            Spacer()
        }
        .padding(Sp.lg)
    }
}

struct ErrorStateView: View {
    let message: String
    let onRetry: () -> Void

    var body: some View {
        VStack(spacing: Sp.lg) {
            Spacer()
            Image(systemName: "exclamationmark")
                .font(.system(size: 26, weight: .regular))
                .foregroundStyle(Color.ink)
                .frame(width: 64, height: 64)
                .background(Color.subtle, in: Circle())
                .overlay(Circle().strokeBorder(Color.hairline, lineWidth: 1))

            VStack(spacing: Sp.sm) {
                Text("Un instant")
                    .font(.title1)
                    .foregroundStyle(Color.ink)
                Text(message)
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Color.inkSoft)
            }
            Spacer()
            PrimaryButton(title: "Réessayer", systemImage: "arrow.clockwise") {
                onRetry()
            }
        }
        .padding(Sp.lg)
    }
}
