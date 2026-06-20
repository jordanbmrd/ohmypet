import { z } from "zod";

export const PetSpeciesSchema = z.enum(["dog", "cat"]);

export const GenerateRequestSchema = z.object({
  imageBase64: z.string().min(100, "imageBase64 is required"),
  theme: z.string().min(1),
  petSpecies: PetSpeciesSchema,
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

export interface GenerateResponse {
  jobId: string;
  status: "completed" | "processing" | "failed";
  resultURL?: string;
  estimatedSeconds?: number;
  error?: string;
}

export interface StatusResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  resultURL?: string;
  error?: string;
}
