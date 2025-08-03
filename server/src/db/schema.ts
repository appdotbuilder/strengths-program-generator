
import { serial, text, pgTable, timestamp, json, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Clifton Strengths themes enum
export const cliftonStrengthsThemeEnum = pgEnum('clifton_strengths_theme', [
  'Achiever', 'Activator', 'Adaptability', 'Analytical', 'Arranger',
  'Belief', 'Command', 'Communication', 'Competition', 'Connectedness',
  'Consistency', 'Context', 'Deliberative', 'Developer', 'Discipline',
  'Empathy', 'Focus', 'Futuristic', 'Harmony', 'Ideation',
  'Includer', 'Individualization', 'Input', 'Intellection', 'Learner',
  'Maximizer', 'Positivity', 'Relator', 'Responsibility', 'Restorative',
  'Self-Assurance', 'Significance', 'Strategic', 'Woo'
]);

// Day of week enum
export const dayOfWeekEnum = pgEnum('day_of_week', [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
]);

// Programs table
export const programsTable = pgTable('programs', {
  id: serial('id').primaryKey(),
  student_name: text('student_name').notNull(),
  educator_name: text('educator_name').notNull(),
  selected_themes: json('selected_themes').$type<string[]>().notNull(), // Array of 7 theme names
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Daily activities table
export const dailyActivitiesTable = pgTable('daily_activities', {
  id: serial('id').primaryKey(),
  program_id: integer('program_id').references(() => programsTable.id, { onDelete: 'cascade' }).notNull(),
  day: dayOfWeekEnum('day').notNull(),
  target_theme: cliftonStrengthsThemeEnum('target_theme').notNull(),
  activity_title: text('activity_title').notNull(),
  activity_description: text('activity_description').notNull(),
  objectives: json('objectives').$type<string[]>().notNull(), // Array of learning objectives
  required_tools: json('required_tools').$type<string[]>().notNull(), // Array of required tools/materials
  estimated_duration_minutes: integer('estimated_duration_minutes').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const programsRelations = relations(programsTable, ({ many }) => ({
  activities: many(dailyActivitiesTable),
}));

export const dailyActivitiesRelations = relations(dailyActivitiesTable, ({ one }) => ({
  program: one(programsTable, {
    fields: [dailyActivitiesTable.program_id],
    references: [programsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Program = typeof programsTable.$inferSelect;
export type NewProgram = typeof programsTable.$inferInsert;
export type DailyActivity = typeof dailyActivitiesTable.$inferSelect;
export type NewDailyActivity = typeof dailyActivitiesTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  programs: programsTable,
  dailyActivities: dailyActivitiesTable
};
