interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_API_KEY: string;
  readonly RESEND_API_KEY: string;
  readonly SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
