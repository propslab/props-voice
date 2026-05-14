export type Plan = "free" | "standard";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          plan: Plan;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          plan?: Plan;
          created_at?: string;
        };
        Update: {
          email?: string | null;
          plan?: Plan;
        };
        Relationships: [];
      };
      stores: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          google_review_url: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          google_review_url: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          google_review_url?: string;
          slug?: string;
        };
        Relationships: [];
      };
      drafts: {
        Row: {
          id: string;
          store_id: string;
          rating: number;
          raw_input: string;
          polished_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          rating: number;
          raw_input: string;
          polished_text?: string | null;
          created_at?: string;
        };
        Update: {
          polished_text?: string | null;
        };
        Relationships: [];
      };
      usage_monthly: {
        Row: {
          id: string;
          user_id: string;
          year_month: string;
          count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          year_month: string;
          count?: number;
        };
        Update: {
          count?: number;
        };
        Relationships: [];
      };
      lead_emails: {
        Row: {
          id: string;
          email: string;
          interested_plan: "standard";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          interested_plan?: "standard";
          created_at?: string;
        };
        Update: {
          email?: string;
          interested_plan?: "standard";
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
