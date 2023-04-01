export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VERCEL_URL:                           string;
    }
  }
}
