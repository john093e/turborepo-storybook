export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL:                         string;
      DATABASE_URL:                         string;
      GITHUB_ID:                            string;
      GITHUB_SECRET:                        string;
      GOOGLE_ID:                            string;
      GOOGLE_SECRET:                        string;
      TWITTER_AUTH_TOKEN:                   string;
      NEXTAUTH_SECRET:                      string;
      EMAIL_PORT:                           number;
      EMAIL_HOST:                           string;
      EMAIL_NAME:                           string;
      EMAIL_PASS:                           string;
      VERCEL_URL:                           string;
      JWT_EXPIRE_SHORT:                     string;
      JWT_SECRET:                           string;
      JWT_SECRET_SHORT:                     string;
      AUTH_BEARER_TOKEN:                    string;
      PROJECT_ID_VERCEL:                    string;
      TEAM_ID_VERCEL:                       string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:   string;
      STRIPE_SECRET_KEY:                    string;
      STRIPE_PAYMENT_DESCRIPTION:           string;
      STRIPE_WEBHOOK_SECRET:                string;
    }
  }
}
