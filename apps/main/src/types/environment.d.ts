export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOCS_URL:                             string;
      VERCEL_URL:                           string;
    }
  }
}
