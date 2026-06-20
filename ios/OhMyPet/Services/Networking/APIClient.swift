import Foundation

/// Thin URLSession wrapper. Holds no business logic — just executes Endpoints.
struct APIClient {
    let baseURL: URL
    let session: URLSession

    init(baseURL: URL = AppEnvironment.apiBaseURL, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    func send<T: Decodable>(_ endpoint: Endpoint, as type: T.Type) async throws -> T {
        let request = endpoint.urlRequest(baseURL: baseURL)

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await session.data(for: request)
        } catch let urlError as URLError {
            throw APIError.network(urlError)
        }

        guard let http = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200..<300).contains(http.statusCode) else {
            let message = (try? JSONDecoder().decode(ErrorBody.self, from: data))?.message
            throw APIError.httpError(status: http.statusCode, message: message)
        }

        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw APIError.decodingFailed
        }
    }

    private struct ErrorBody: Decodable {
        let error: String?
        let message: String?
    }
}
