import Foundation

enum APIError: LocalizedError {
    case invalidResponse
    case httpError(status: Int, message: String?)
    case decodingFailed
    case generationFailed(String)
    case network(URLError)

    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            "Réponse invalide du serveur."
        case let .httpError(status, message):
            message ?? "Erreur serveur (\(status))."
        case .decodingFailed:
            "Impossible de lire la réponse du serveur."
        case let .generationFailed(reason):
            reason
        case .network:
            "Connexion impossible. Vérifie ta connexion internet."
        }
    }
}
