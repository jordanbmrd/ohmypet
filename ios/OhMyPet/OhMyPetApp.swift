import SwiftUI

@main
struct OhMyPetApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var router = AppRouter()
    @StateObject private var cart = CartStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(appState)
                .environmentObject(router)
                .environmentObject(cart)
                .tint(.ink)
        }
    }
}

struct RootView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        Group {
            if appState.hasSeenOnboarding {
                HomeFlowView()
            } else {
                OnboardingView()
            }
        }
        .animation(Anim.smooth, value: appState.hasSeenOnboarding)
    }
}
