import Foundation

enum Endpoint {
    case generate(body: Data)
    case status(jobId: String)

    var path: String {
        switch self {
        case .generate: "/generate"
        case let .status(jobId): "/status/\(jobId)"
        }
    }

    var method: String {
        switch self {
        case .generate: "POST"
        case .status: "GET"
        }
    }

    var body: Data? {
        switch self {
        case let .generate(body): body
        case .status: nil
        }
    }

    func urlRequest(baseURL: URL) -> URLRequest {
        var request = URLRequest(url: baseURL.appendingPathComponent(path))
        request.httpMethod = method
        request.httpBody = body
        if body != nil {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        request.timeoutInterval = 30 // each call is fast; generation is polled via /status
        return request
    }
}
