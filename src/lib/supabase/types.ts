export type Plan = "free" | "standard";
export type PolishStyle = "formal" | "casual";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          plan: Plan;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan_updated_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          plan?: Plan;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_updated_at?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string | null;
          plan?: Plan;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_updated_at?: string | null;
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
          polish_style: PolishStyle;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          google_review_url: string;
          slug: string;
          polish_style?: PolishStyle;
          created_at?: string;
        };
        Update: {
          name?: string;
          google_review_url?: string;
          slug?: string;
          polish_style?: PolishStyle;
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
          edited_polished_text: string | null;
          edited_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          rating: number;
          raw_input: string;
          polished_text?: string | null;
          edited_polished_text?: string | null;
          edited_at?: string | null;
          created_at?: string;
        };
        Update: {
          polished_text?: string | null;
          edited_polished_text?: string | null;
          edited_at?: string | null;
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
