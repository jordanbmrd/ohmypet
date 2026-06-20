import SwiftUI

enum AppRoute: Hashable {
    case themeSelection(pet: Pet)
    case generationLoading(pet: Pet, theme: PosterTheme)
    case result(job: GenerationJob, theme: PosterTheme)
    case productDetail(category: ProductCategory, imageURL: URL, themeTitle: String)
    case cart
}

/// Owns the navigation stack path so views never reference each other directly.
@MainActor
final class AppRouter: ObservableObject {
    @Published var path = NavigationPath()

    func push(_ route: AppRoute) {
        path.append(route)
    }

    func pop() {
        guard !path.isEmpty else { return }
        path.removeLast()
    }

    func popToRoot() {
        path = NavigationPath()
    }
}
