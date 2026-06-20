import Foundation

/// Talks to the AWS backend: kicks off generation and (optionally) polls status.
struct GenerationService {
    let client: APIClient

    init(client: APIClient = APIClient()) {
        self.client = client
    }

    /// POST /generate then poll GET /status until the job completes.
    /// The backend is asynchronous: /generate returns `processing` immediately
    /// (gpt-image-1 takes 30-90s, over the API Gateway 30s limit), and the worker
    /// flips the job to `completed` (with resultURL) or `failed` out of band.
    func generate(pet: Pet, theme: PosterTheme) async throws -> GenerationJob {
        let payload = GenerateRequestBody(
            imageBase64: pet.imageData.base64EncodedString(),
            theme: theme.rawValue,
            petSpecies: pet.species.rawValue
        )
        let body = try JSONEncoder().encode(payload)
        let job = try await client.send(.generate(body: body), as: GenerationJob.self)

        if job.status == .failed {
            throw APIError.generationFailed(job.error ?? "La génération a échoué.")
        }
        if job.status == .completed, job.resultURL != nil {
            return job
        }
        return try await poll(jobId: job.jobId)
    }

    /// Polls /status every `interval` seconds until the job reaches a terminal
    /// state or `timeout` elapses.
    private func poll(
        jobId: String,
        interval: Duration = .seconds(3),
        timeout: Duration = .seconds(180)
    ) async throws -> GenerationJob {
        let deadline = ContinuousClock.now + timeout
        while ContinuousClock.now < deadline {
            try Task.checkCancellation()
            try await Task.sleep(for: interval)

            let job = try await checkStatus(jobId: jobId)
            switch job.status {
            case .completed where job.resultURL != nil:
                return job
            case .failed:
                throw APIError.generationFailed(job.error ?? "La génération a échoué.")
            default:
                continue
            }
        }
        throw APIError.generationFailed("La création prend plus de temps que prévu. Réessayez.")
    }

    /// GET /status/{jobId} — used by the polling loop / async pipeline.
    func checkStatus(jobId: String) async throws -> GenerationJob {
        try await client.send(.status(jobId: jobId), as: GenerationJob.self)
    }

    private struct GenerateRequestBody: Encodable {
        let imageBase64: String
        let theme: String
        let petSpecies: String
    }
}
