export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type PetSpecies = "dog" | "cat";

export interface JobRecord {
  jobId: string;
  status: JobStatus;
  theme: string;
  petSpecies: PetSpecies;
  inputImageKey?: string;
  resultImageKey?: string;
  resultURL?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  /** Unix epoch seconds — DynamoDB TTL auto-deletes the row. */
  ttl: number;
}
