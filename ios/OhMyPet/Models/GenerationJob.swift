import Foundation

enum GenerationStatus: String, Codable {
    case pending
    case processing
    case completed
    case failed
}

/// Mirrors the backend `/generate` and `/status` responses.
struct GenerationJob: Codable, Hashable {
    let jobId: String
    let status: GenerationStatus
    var resultURL: String?
    var error: String?
    var estimatedSeconds: Int?

    var resultImageURL: URL? {
        guard let resultURL else { return nil }
        return URL(string: resultURL)
    }
}
