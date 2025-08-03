
import { z } from 'zod';

// Clifton Strengths 34 themes enum
export const cliftonStrengthsThemes = [
  'Achiever', 'Activator', 'Adaptability', 'Analytical', 'Arranger',
  'Belief', 'Command', 'Communication', 'Competition', 'Connectedness',
  'Consistency', 'Context', 'Deliberative', 'Developer', 'Discipline',
  'Empathy', 'Focus', 'Futuristic', 'Harmony', 'Ideation',
  'Includer', 'Individualization', 'Input', 'Intellection', 'Learner',
  'Maximizer', 'Positivity', 'Relator', 'Responsibility', 'Restorative',
  'Self-Assurance', 'Significance', 'Strategic', 'Woo'
] as const;

export const cliftonStrengthsThemeSchema = z.enum(cliftonStrengthsThemes);
export type CliftonStrengthsTheme = z.infer<typeof cliftonStrengthsThemeSchema>;

// Day of week enum
export const dayOfWeekSchema = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>;

// Program schema
export const programSchema = z.object({
  id: z.number(),
  student_name: z.string(),
  educator_name: z.string(),
  selected_themes: z.array(cliftonStrengthsThemeSchema).length(7),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Program = z.infer<typeof programSchema>;

// Daily activity schema
export const dailyActivitySchema = z.object({
  id: z.number(),
  program_id: z.number(),
  day: dayOfWeekSchema,
  target_theme: cliftonStrengthsThemeSchema,
  activity_title: z.string(),
  activity_description: z.string(),
  objectives: z.array(z.string()),
  required_tools: z.array(z.string()),
  estimated_duration_minutes: z.number().int().positive(),
  created_at: z.coerce.date()
});

export type DailyActivity = z.infer<typeof dailyActivitySchema>;

// Input schemas
export const createProgramInputSchema = z.object({
  student_name: z.string().min(1),
  educator_name: z.string().min(1),
  selected_themes: z.array(cliftonStrengthsThemeSchema)
    .length(7, "Must select exactly 7 dominant talent themes")
    .refine(themes => new Set(themes).size === 7, "All themes must be unique")
});

export type CreateProgramInput = z.infer<typeof createProgramInputSchema>;

export const updateProgramInputSchema = z.object({
  id: z.number(),
  student_name: z.string().min(1).optional(),
  educator_name: z.string().min(1).optional(),
  selected_themes: z.array(cliftonStrengthsThemeSchema)
    .length(7, "Must select exactly 7 dominant talent themes")
    .refine(themes => new Set(themes).size === 7, "All themes must be unique")
    .optional()
});

export type UpdateProgramInput = z.infer<typeof updateProgramInputSchema>;

export const getProgramInputSchema = z.object({
  id: z.number()
});

export type GetProgramInput = z.infer<typeof getProgramInputSchema>;

export const deleteProgramInputSchema = z.object({
  id: z.number()
});

export type DeleteProgramInput = z.infer<typeof deleteProgramInputSchema>;

// Program with activities schema for full program view
export const programWithActivitiesSchema = z.object({
  id: z.number(),
  student_name: z.string(),
  educator_name: z.string(),
  selected_themes: z.array(cliftonStrengthsThemeSchema),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  activities: z.array(dailyActivitySchema)
});

export type ProgramWithActivities = z.infer<typeof programWithActivitiesSchema>;

// Export PDF input schema
export const exportProgramToPdfInputSchema = z.object({
  id: z.number()
});

export type ExportProgramToPdfInput = z.infer<typeof exportProgramToPdfInputSchema>;
