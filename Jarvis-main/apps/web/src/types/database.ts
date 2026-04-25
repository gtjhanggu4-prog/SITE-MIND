export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: { Row: any; Insert: any; Update: any };
      floor_plans: { Row: any; Insert: any; Update: any };
      tenant_recommendations: { Row: any; Insert: any; Update: any };
      cost_models: { Row: any; Insert: any; Update: any };
      leads: { Row: any; Insert: any; Update: any };
      contract_drafts: { Row: any; Insert: any; Update: any };
      reports: { Row: any; Insert: any; Update: any };
      project_files: { Row: any; Insert: any; Update: any };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// TODO(supabase-types): `supabase gen types typescript` 결과로 교체
