import Foundation

/// Talks to the AWS backend: kicks off generation and (optionally) polls status.
struct GenerationService {
    let client: APIClient

    init(client: APIClient = APIClient()) {
        self.client = client
    }

    /// POST /generate — returns the completed job (backend is synchronous in Phase 1).
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
        return job
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
