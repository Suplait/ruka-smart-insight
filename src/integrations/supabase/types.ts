export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      lead_calendar_reconciliation: {
        Row: {
          attempts: number
          cycle_completed_at: string | null
          cycle_started_at: string
          last_error: string | null
          lease_id: string | null
          lease_until: string | null
          next_attempt_at: string
          pages_processed: number
          revision: number
          state: Json
          updated_at: string
          user_uri: string
        }
        Insert: {
          attempts?: number
          cycle_completed_at?: string | null
          cycle_started_at?: string
          last_error?: string | null
          lease_id?: string | null
          lease_until?: string | null
          next_attempt_at?: string
          pages_processed?: number
          revision?: number
          state: Json
          updated_at?: string
          user_uri: string
        }
        Update: {
          attempts?: number
          cycle_completed_at?: string | null
          cycle_started_at?: string
          last_error?: string | null
          lease_id?: string | null
          lease_until?: string | null
          next_attempt_at?: string
          pages_processed?: number
          revision?: number
          state?: Json
          updated_at?: string
          user_uri?: string
        }
        Relationships: []
      }
      lead_calendly_receipts: {
        Row: {
          event_key: string
          evidence: Json
          invitee_uri: string
          occurred_at: string
          received_at: string
          source: string
        }
        Insert: {
          event_key: string
          evidence: Json
          invitee_uri: string
          occurred_at: string
          received_at?: string
          source: string
        }
        Update: {
          event_key?: string
          evidence?: Json
          invitee_uri?: string
          occurred_at?: string
          received_at?: string
          source?: string
        }
        Relationships: []
      }
      lead_delivery_outbox: {
        Row: {
          attempts: number
          delivered_at: string | null
          delivered_revision: number
          destination: string
          id: number
          last_error: string | null
          lease_id: string | null
          lease_until: string | null
          next_attempt_at: string
          revision: number
          state: string
          submission_id: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          delivered_at?: string | null
          delivered_revision?: number
          destination: string
          id?: never
          last_error?: string | null
          lease_id?: string | null
          lease_until?: string | null
          next_attempt_at?: string
          revision?: number
          state?: string
          submission_id: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          delivered_at?: string | null
          delivered_revision?: number
          destination?: string
          id?: never
          last_error?: string | null
          lease_id?: string | null
          lease_until?: string | null
          next_attempt_at?: string
          revision?: number
          state?: string
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_delivery_outbox_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "lead_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_journey_events: {
        Row: {
          event_key: string
          id: number
          name: string
          occurred_at: string
          properties: Json
          received_at: string
          source: string
          submission_id: string
        }
        Insert: {
          event_key: string
          id?: never
          name: string
          occurred_at: string
          properties?: Json
          received_at?: string
          source: string
          submission_id: string
        }
        Update: {
          event_key?: string
          id?: never
          name?: string
          occurred_at?: string
          properties?: Json
          received_at?: string
          source?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_journey_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "lead_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_meetings: {
        Row: {
          association_method: string
          booked_at: string
          event_uri: string
          invitee_email_hash: string | null
          invitee_uri: string
          new_invitee_uri: string | null
          old_invitee_uri: string | null
          received_at: string
          source: string
          source_updated_at: string
          starts_at: string | null
          status: string
          submission_id: string | null
        }
        Insert: {
          association_method: string
          booked_at: string
          event_uri: string
          invitee_email_hash?: string | null
          invitee_uri: string
          new_invitee_uri?: string | null
          old_invitee_uri?: string | null
          received_at?: string
          source: string
          source_updated_at: string
          starts_at?: string | null
          status: string
          submission_id?: string | null
        }
        Update: {
          association_method?: string
          booked_at?: string
          event_uri?: string
          invitee_email_hash?: string | null
          invitee_uri?: string
          new_invitee_uri?: string | null
          old_invitee_uri?: string | null
          received_at?: string
          source?: string
          source_updated_at?: string
          starts_at?: string | null
          status?: string
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_meetings_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "lead_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_submissions: {
        Row: {
          attribution: Json | null
          clickup_task_id: string | null
          contact_snapshot: Json
          created_at: string
          email_hash: string | null
          funnel: string
          id: string
          lead_id: number | null
          one_lead_id: number | null
          slack_channel_id: string | null
          slack_initial_claimed_at: string | null
          slack_initial_message: Json | null
          slack_initial_state: string
          slack_message_ts: string | null
          status: string
          token_expires_at: string | null
          token_hash: string | null
          updated_at: string
        }
        Insert: {
          attribution?: Json | null
          clickup_task_id?: string | null
          contact_snapshot?: Json
          created_at?: string
          email_hash?: string | null
          funnel: string
          id: string
          lead_id?: number | null
          one_lead_id?: number | null
          slack_channel_id?: string | null
          slack_initial_claimed_at?: string | null
          slack_initial_message?: Json | null
          slack_initial_state?: string
          slack_message_ts?: string | null
          status?: string
          token_expires_at?: string | null
          token_hash?: string | null
          updated_at?: string
        }
        Update: {
          attribution?: Json | null
          clickup_task_id?: string | null
          contact_snapshot?: Json
          created_at?: string
          email_hash?: string | null
          funnel?: string
          id?: string
          lead_id?: number | null
          one_lead_id?: number | null
          slack_channel_id?: string | null
          slack_initial_claimed_at?: string | null
          slack_initial_message?: Json | null
          slack_initial_state?: string
          slack_message_ts?: string | null
          status?: string
          token_expires_at?: string | null
          token_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_submissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_submissions_one_lead_id_fkey"
            columns: ["one_lead_id"]
            isOneToOne: true
            referencedRelation: "leads_one"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_traceability_health: {
        Row: {
          job: string
          last_completed_at: string | null
          last_started_at: string
          result: Json
        }
        Insert: {
          job: string
          last_completed_at?: string | null
          last_started_at: string
          result?: Json
        }
        Update: {
          job?: string
          last_completed_at?: string | null
          last_started_at?: string
          result?: Json
        }
        Relationships: []
      }
      leads: {
        Row: {
          ccity: string
          clave_sii: string | null
          codigo_promocional: string | null
          company_name: string
          created_at: string
          email: string
          facturas_compra_mes: number | null
          first_name: string | null
          id: number
          last_name: string | null
          meses_datos: number | null
          name: string
          page_path: string | null
          requires_calendly: boolean | null
          rut: string | null
          sii_connected: boolean | null
          sistema_custom: string | null
          sistema_facturacion: string | null
          slack_message_ts: string | null
          subdomain_ready: boolean | null
          subdominio: string | null
          submission_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          whatsapp: string | null
        }
        Insert: {
          ccity: string
          clave_sii?: string | null
          codigo_promocional?: string | null
          company_name: string
          created_at?: string
          email: string
          facturas_compra_mes?: number | null
          first_name?: string | null
          id?: never
          last_name?: string | null
          meses_datos?: number | null
          name: string
          page_path?: string | null
          requires_calendly?: boolean | null
          rut?: string | null
          sii_connected?: boolean | null
          sistema_custom?: string | null
          sistema_facturacion?: string | null
          slack_message_ts?: string | null
          subdomain_ready?: boolean | null
          subdominio?: string | null
          submission_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
        }
        Update: {
          ccity?: string
          clave_sii?: string | null
          codigo_promocional?: string | null
          company_name?: string
          created_at?: string
          email?: string
          facturas_compra_mes?: number | null
          first_name?: string | null
          id?: never
          last_name?: string | null
          meses_datos?: number | null
          name?: string
          page_path?: string | null
          requires_calendly?: boolean | null
          rut?: string | null
          sii_connected?: boolean | null
          sistema_custom?: string | null
          sistema_facturacion?: string | null
          slack_message_ts?: string | null
          subdomain_ready?: boolean | null
          subdominio?: string | null
          submission_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      leads_one: {
        Row: {
          calendly_event_uri: string | null
          calendly_scheduled_at: string | null
          calendly_slack_notified_at: string | null
          company: string
          created_at: string
          email: string
          id: number
          landing_path: string
          name: string
          slack_notified_at: string | null
          slack_thread_ts: string | null
          status: string
          submission_id: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          whatsapp: string
        }
        Insert: {
          calendly_event_uri?: string | null
          calendly_scheduled_at?: string | null
          calendly_slack_notified_at?: string | null
          company: string
          created_at?: string
          email: string
          id?: number
          landing_path?: string
          name: string
          slack_notified_at?: string | null
          slack_thread_ts?: string | null
          status?: string
          submission_id: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp: string
        }
        Update: {
          calendly_event_uri?: string | null
          calendly_scheduled_at?: string | null
          calendly_slack_notified_at?: string | null
          company?: string
          created_at?: string
          email?: string
          id?: number
          landing_path?: string
          name?: string
          slack_notified_at?: string | null
          slack_thread_ts?: string | null
          status?: string
          submission_id?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      organic_growth_experiments: {
        Row: {
          affected_urls: string[]
          baseline: Json
          conclusion: string | null
          deployed_at: string | null
          deployment_url: string | null
          detected_at: string
          evaluate_after: string | null
          evidence: Json
          exact_changes: string | null
          git_sha: string | null
          hypothesis: string
          id: string
          implemented_at: string | null
          indexation_status: Json
          opportunity_id: string | null
          results: Json
          run_id: string | null
          status: string
          success_metrics: Json
          target_cluster: string | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_urls?: string[]
          baseline?: Json
          conclusion?: string | null
          deployed_at?: string | null
          deployment_url?: string | null
          detected_at?: string
          evaluate_after?: string | null
          evidence?: Json
          exact_changes?: string | null
          git_sha?: string | null
          hypothesis: string
          id?: string
          implemented_at?: string | null
          indexation_status?: Json
          opportunity_id?: string | null
          results?: Json
          run_id?: string | null
          status?: string
          success_metrics?: Json
          target_cluster?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_urls?: string[]
          baseline?: Json
          conclusion?: string | null
          deployed_at?: string | null
          deployment_url?: string | null
          detected_at?: string
          evaluate_after?: string | null
          evidence?: Json
          exact_changes?: string | null
          git_sha?: string | null
          hypothesis?: string
          id?: string
          implemented_at?: string | null
          indexation_status?: Json
          opportunity_id?: string | null
          results?: Json
          run_id?: string | null
          status?: string
          success_metrics?: Json
          target_cluster?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organic_growth_experiments_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "organic_growth_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organic_growth_experiments_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "organic_growth_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      organic_growth_opportunities: {
        Row: {
          approval_reason: string | null
          cluster: string
          commercial_intent: number
          demand_confidence: number
          effort: number
          evidence: Json
          fingerprint: string
          first_seen_at: string
          id: string
          intent: string
          last_seen_at: string
          priority_score: number | null
          risk: number
          ruka_advantage: number
          status: string
          target_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_reason?: string | null
          cluster: string
          commercial_intent: number
          demand_confidence: number
          effort: number
          evidence?: Json
          fingerprint: string
          first_seen_at?: string
          id?: string
          intent: string
          last_seen_at?: string
          priority_score?: number | null
          risk: number
          ruka_advantage: number
          status?: string
          target_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_reason?: string | null
          cluster?: string
          commercial_intent?: number
          demand_confidence?: number
          effort?: number
          evidence?: Json
          fingerprint?: string
          first_seen_at?: string
          id?: string
          intent?: string
          last_seen_at?: string
          priority_score?: number | null
          risk?: number
          ruka_advantage?: number
          status?: string
          target_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      organic_growth_product_signals: {
        Row: {
          capability: string
          commercial_problem: string | null
          fingerprint: string
          id: string
          maturity: string
          observed_at: string
          public_safe_summary: string
          repository: string
          reviewed_at: string | null
          source_ref: string
          supporting_evidence: Json
          updated_at: string
        }
        Insert: {
          capability: string
          commercial_problem?: string | null
          fingerprint: string
          id?: string
          maturity: string
          observed_at?: string
          public_safe_summary: string
          repository: string
          reviewed_at?: string | null
          source_ref: string
          supporting_evidence?: Json
          updated_at?: string
        }
        Update: {
          capability?: string
          commercial_problem?: string | null
          fingerprint?: string
          id?: string
          maturity?: string
          observed_at?: string
          public_safe_summary?: string
          repository?: string
          reviewed_at?: string | null
          source_ref?: string
          supporting_evidence?: Json
          updated_at?: string
        }
        Relationships: []
      }
      organic_growth_reports: {
        Row: {
          created_at: string
          delivered_at: string | null
          delivery_status: string
          id: string
          payload: Json
          period_end: string
          run_id: string | null
          slack_channel_id: string | null
          slack_timestamp: string | null
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string
          id?: string
          payload: Json
          period_end: string
          run_id?: string | null
          slack_channel_id?: string | null
          slack_timestamp?: string | null
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string
          id?: string
          payload?: Json
          period_end?: string
          run_id?: string | null
          slack_channel_id?: string | null
          slack_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organic_growth_reports_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "organic_growth_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      organic_growth_runs: {
        Row: {
          created_at: string
          data_through_date: string | null
          deployment_url: string | null
          error_message: string | null
          finished_at: string | null
          git_sha: string | null
          id: string
          kind: string
          pull_request_url: string | null
          started_at: string
          status: string
          summary: Json
          trigger_source: string
        }
        Insert: {
          created_at?: string
          data_through_date?: string | null
          deployment_url?: string | null
          error_message?: string | null
          finished_at?: string | null
          git_sha?: string | null
          id?: string
          kind: string
          pull_request_url?: string | null
          started_at?: string
          status?: string
          summary?: Json
          trigger_source?: string
        }
        Update: {
          created_at?: string
          data_through_date?: string | null
          deployment_url?: string | null
          error_message?: string | null
          finished_at?: string | null
          git_sha?: string | null
          id?: string
          kind?: string
          pull_request_url?: string | null
          started_at?: string
          status?: string
          summary?: Json
          trigger_source?: string
        }
        Relationships: []
      }
      organic_growth_snapshots: {
        Row: {
          captured_at: string
          data_through_date: string
          id: number
          payload: Json
          property: string
          run_id: string | null
        }
        Insert: {
          captured_at?: string
          data_through_date: string
          id?: number
          payload: Json
          property?: string
          run_id?: string | null
        }
        Update: {
          captured_at?: string
          data_through_date?: string
          id?: number
          payload?: Json
          property?: string
          run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organic_growth_snapshots_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "organic_growth_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      organic_growth_state: {
        Row: {
          engine_key: string
          execution_lease_expires_at: string | null
          execution_lease_run_id: string | null
          last_data_through_date: string | null
          last_execution_success_at: string | null
          last_report_success_at: string | null
          next_execution_at: string
          next_report_at: string
          reporting_lease_expires_at: string | null
          reporting_lease_run_id: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          engine_key?: string
          execution_lease_expires_at?: string | null
          execution_lease_run_id?: string | null
          last_data_through_date?: string | null
          last_execution_success_at?: string | null
          last_report_success_at?: string | null
          next_execution_at?: string
          next_report_at?: string
          reporting_lease_expires_at?: string | null
          reporting_lease_run_id?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          engine_key?: string
          execution_lease_expires_at?: string | null
          execution_lease_run_id?: string | null
          last_data_through_date?: string | null
          last_execution_success_at?: string | null
          last_report_success_at?: string | null
          next_execution_at?: string
          next_report_at?: string
          reporting_lease_expires_at?: string | null
          reporting_lease_run_id?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      webinar_leads: {
        Row: {
          correo: string
          created_at: string
          id: string
          nombre: string
          webinar_name: string
          whatsapp: string
        }
        Insert: {
          correo: string
          created_at?: string
          id?: string
          nombre: string
          webinar_name: string
          whatsapp: string
        }
        Update: {
          correo?: string
          created_at?: string
          id?: string
          nombre?: string
          webinar_name?: string
          whatsapp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_organic_growth_job: {
        Args: { p_force?: boolean; p_kind: string; p_trigger_source?: string }
        Returns: {
          claimed: boolean
          next_due_at: string
          reason: string
          run_id: string
        }[]
      }
      finish_organic_growth_job: {
        Args: {
          p_data_through_date?: string
          p_deployment_url?: string
          p_error_message?: string
          p_git_sha?: string
          p_pull_request_url?: string
          p_run_id: string
          p_success: boolean
          p_summary?: Json
        }
        Returns: boolean
      }
      organic_growth_next_report_at: {
        Args: { p_after: string }
        Returns: string
      }
      trace_associate_meeting: {
        Args: { p_invitee_uri: string }
        Returns: string
      }
      trace_authorize_submission: {
        Args: { p_id: string; p_token_hash: string }
        Returns: {
          attribution: Json | null
          clickup_task_id: string | null
          contact_snapshot: Json
          created_at: string
          email_hash: string | null
          funnel: string
          id: string
          lead_id: number | null
          one_lead_id: number | null
          slack_channel_id: string | null
          slack_initial_claimed_at: string | null
          slack_initial_message: Json | null
          slack_initial_state: string
          slack_message_ts: string | null
          status: string
          token_expires_at: string | null
          token_hash: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "lead_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      trace_claim_calendar_reconciliation: {
        Args: { p_user_uri: string }
        Returns: {
          attempts: number
          cycle_completed_at: string | null
          cycle_started_at: string
          last_error: string | null
          lease_id: string | null
          lease_until: string | null
          next_attempt_at: string
          pages_processed: number
          revision: number
          state: Json
          updated_at: string
          user_uri: string
        }
        SetofOptions: {
          from: "*"
          to: "lead_calendar_reconciliation"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      trace_claim_clickup_delivery: { Args: never; Returns: Json }
      trace_claim_deliveries: {
        Args: { p_limit?: number }
        Returns: {
          attempts: number
          delivered_at: string | null
          delivered_revision: number
          destination: string
          id: number
          last_error: string | null
          lease_id: string | null
          lease_until: string | null
          next_attempt_at: string
          revision: number
          state: string
          submission_id: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "lead_delivery_outbox"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      trace_claim_initial_slack: { Args: { p_id: string }; Returns: boolean }
      trace_claim_slack_deliveries: {
        Args: { p_limit?: number }
        Returns: {
          attempts: number
          delivered_at: string | null
          delivered_revision: number
          destination: string
          id: number
          last_error: string | null
          lease_id: string | null
          lease_until: string | null
          next_attempt_at: string
          revision: number
          state: string
          submission_id: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "lead_delivery_outbox"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      trace_commit_calendar_reconciliation: {
        Args: {
          p_lease: string
          p_meetings: Json
          p_revision: number
          p_state: Json
          p_user_uri: string
        }
        Returns: boolean
      }
      trace_confirm_initial_slack: {
        Args: { p_channel: string; p_id: string; p_ts: string }
        Returns: undefined
      }
      trace_defer_delivery: {
        Args: { p_id: number; p_lease: string; p_reason: string }
        Returns: boolean
      }
      trace_finish_delivery: {
        Args: {
          p_error?: string
          p_id: number
          p_lease: string
          p_retry_after?: number
          p_revision: number
        }
        Returns: boolean
      }
      trace_link_clickup: {
        Args: { p_list_id: string; p_submission: string; p_task_id: string }
        Returns: boolean
      }
      trace_observe_calendar: {
        Args: {
          p_event_uri: string
          p_id: string
          p_invitee_uri?: string
          p_token_hash: string
        }
        Returns: undefined
      }
      trace_prepare_submission: {
        Args: {
          p_attribution: Json
          p_contact: Json
          p_funnel: string
          p_id: string
          p_token_hash: string
        }
        Returns: {
          attribution: Json | null
          clickup_task_id: string | null
          contact_snapshot: Json
          created_at: string
          email_hash: string | null
          funnel: string
          id: string
          lead_id: number | null
          one_lead_id: number | null
          slack_channel_id: string | null
          slack_initial_claimed_at: string | null
          slack_initial_message: Json | null
          slack_initial_state: string
          slack_message_ts: string | null
          status: string
          token_expires_at: string | null
          token_hash: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "lead_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      trace_qualify_lead: {
        Args: { p_id: string; p_invoice_count: number; p_token_hash: string }
        Returns: undefined
      }
      trace_queue_enrichment: {
        Args: { p_submission: string }
        Returns: undefined
      }
      trace_reconcile_unmatched_meetings: {
        Args: { p_limit?: number }
        Returns: number
      }
      trace_record_calendly: {
        Args: { p_meeting: Json; p_source?: string }
        Returns: undefined
      }
      trace_release_calendar_reconciliation: {
        Args: {
          p_error?: string
          p_lease: string
          p_retry_after?: number
          p_user_uri: string
        }
        Returns: boolean
      }
      trace_submit_lead: {
        Args: { p_id: string; p_lead: Json; p_token_hash: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
