// src/lib/validation.ts
import { z } from 'zod';
import type { ValidationResult } from '@/types';

const linkSchema = z.record(z.string().url("Link must be a valid URL"));

export const authorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Author name is required"),
  ipi: z.string().optional(),
  share: z.string().regex(/^\d{1,3}$/, "Share must be a number between 0-100").optional(),
  role: z.string().optional()
});

export const artistSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Artist name is required"),
  isni: z.string().optional(),
  links: linkSchema
});

export const contributingArtistSchema = artistSchema.extend({
  ipn: z.string().optional(),
  ipi: z.string().optional(),
  roles: z.array(z.string()).min(1, "At least one role is required")
});

export const cip60FormSchema = z.object({
  releaseTitle: z.string().min(1, "Release title is required"),
  songTitle: z.string().min(1, "Song title is required"),
  isAIGenerated: z.boolean(),
  isExplicit: z.boolean(),
  recordingOwner: z.string().min(1, "Recording owner is required"),
  // Allow empty string for composition owner, we'll validate it in the refinement
  compositionOwner: z.string(),
  isrc: z.string().optional(),
  iswc: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  producer: z.string().optional(),
  mastering_engineer: z.string().optional(),
  mix_engineer: z.string().optional(),
  genre: z.string().min(1, "Primary genre is required"),
  subGenre1: z.string().optional(),
  subGenre2: z.string().optional(),
  songFile: z.instanceof(File, { message: "Song file is required" }).nullable().refine(val => val !== null, "Song file is required"),
  coverArtFile: z.instanceof(File, { message: "Cover art is required" }).nullable().refine(val => val !== null, "Cover art is required"),
  artists: z.array(artistSchema).min(1, "At least one artist is required"),
  featuredArtists: z.array(artistSchema).optional().default([]),
  contributingArtists: z.array(contributingArtistSchema).optional().default([]),
  authors: z.array(authorSchema).optional().default([])
}).refine(data => {
  // If it's AI generated, composition owner is not required
  if (data.isAIGenerated) return true;
  
  // Otherwise, composition owner is required
  return data.compositionOwner.trim().length > 0;
}, {
  message: "Composition owner is required when not AI generated",
  path: ["compositionOwner"]
}).refine(data => {
  // Skip validation if no authors or is AI generated
  if (data.isAIGenerated || data.authors.length === 0) return true;
  
  // Calculate total share
  const totalShare = data.authors.reduce((sum, author) => {
    const share = author.share ? parseInt(author.share, 10) : 0;
    return sum + share;
  }, 0);
  
  // Total must be 100% if any authors have shares
  const hasShares = data.authors.some(author => author.share);
  return !hasShares || totalShare === 100;
}, {
  message: "Author shares must total 100%",
  path: ["authors"]
});

export function validateField<T extends z.ZodType>(
  schema: T, 
  field: string, 
  value: unknown
): { valid: boolean; error?: string } {
  const fieldSchema = z.object({ [field]: schema });
  const result = fieldSchema.safeParse({ [field]: value });
  
  if (result.success) {
    return { valid: true };
  }
  
  const error = result.error.errors.find(err => err.path[0] === field);
  return { 
    valid: false, 
    error: error?.message 
  };
}

export function validateForm(formData: unknown): ValidationResult {
  const result = cip60FormSchema.safeParse(formData);
  
  if (result.success) {
    return { valid: true, errors: [] };
  }
  
  const errors = result.error.errors.map(err => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
  
  return {
    valid: false,
    errors
  };
}

export function getFieldErrors(formData: unknown): Record<string, string> {
  const result = cip60FormSchema.safeParse(formData);
  
  if (result.success) {
    return {};
  }
  
  const errorMap: Record<string, string> = {};
  
  result.error.errors.forEach(err => {
    const path = err.path.join('.');
    errorMap[path] = err.message;
  });
  
  return errorMap;
}

export type FormErrors = ReturnType<typeof getFieldErrors>;

export type { ValidationResult };
