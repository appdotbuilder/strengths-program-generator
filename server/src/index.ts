
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createProgramInputSchema,
  updateProgramInputSchema,
  getProgramInputSchema,
  deleteProgramInputSchema,
  exportProgramToPdfInputSchema
} from './schema';

// Import handlers
import { createProgram } from './handlers/create_program';
import { getPrograms } from './handlers/get_programs';
import { getProgramWithActivities } from './handlers/get_program_with_activities';
import { updateProgram } from './handlers/update_program';
import { deleteProgram } from './handlers/delete_program';
import { exportProgramToPdf } from './handlers/export_program_to_pdf';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Create a new individualized program
  createProgram: publicProcedure
    .input(createProgramInputSchema)
    .mutation(({ input }) => createProgram(input)),

  // Get all programs (without detailed activities)
  getPrograms: publicProcedure
    .query(() => getPrograms()),

  // Get a specific program with all activities
  getProgramWithActivities: publicProcedure
    .input(getProgramInputSchema)
    .query(({ input }) => getProgramWithActivities(input)),

  // Update an existing program
  updateProgram: publicProcedure
    .input(updateProgramInputSchema)
    .mutation(({ input }) => updateProgram(input)),

  // Delete a program
  deleteProgram: publicProcedure
    .input(deleteProgramInputSchema)
    .mutation(({ input }) => deleteProgram(input)),

  // Export program as PDF
  exportProgramToPdf: publicProcedure
    .input(exportProgramToPdfInputSchema)
    .query(({ input }) => exportProgramToPdf(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
