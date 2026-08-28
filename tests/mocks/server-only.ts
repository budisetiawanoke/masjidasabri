// No-op stand-in for the "server-only" package inside the Vitest environment.
// The real package throws when imported outside Next.js's server compilation
// graph, which includes Vitest's Node/jsdom runner — so tests that exercise
// server/* modules (which import "server-only" as a guard against accidental
// client bundling) need this alias. See vitest.config.ts.
export {};
