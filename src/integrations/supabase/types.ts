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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          last_sign_in: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_sign_in?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_sign_in?: string | null
        }
        Relationships: []
      }
      business_contacts: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      client_payments_feedback: {
        Row: {
          company_name: string | null
          completion_date: string | null
          confirm_details: boolean
          confirm_payment: boolean
          created_at: string | null
          email: string
          feedback: string | null
          full_name: string
          id: number
          payment_amount: number | null
          payment_screenshot_url: string | null
          phone: string | null
          project_name: string | null
          rating: number
          service_provided: string | null
          share_publicly: string | null
          submitted_at: string | null
          suggestions: string | null
          transaction_id: string | null
        }
        Insert: {
          company_name?: string | null
          completion_date?: string | null
          confirm_details?: boolean
          confirm_payment?: boolean
          created_at?: string | null
          email: string
          feedback?: string | null
          full_name: string
          id?: number
          payment_amount?: number | null
          payment_screenshot_url?: string | null
          phone?: string | null
          project_name?: string | null
          rating: number
          service_provided?: string | null
          share_publicly?: string | null
          submitted_at?: string | null
          suggestions?: string | null
          transaction_id?: string | null
        }
        Update: {
          company_name?: string | null
          completion_date?: string | null
          confirm_details?: boolean
          confirm_payment?: boolean
          created_at?: string | null
          email?: string
          feedback?: string | null
          full_name?: string
          id?: number
          payment_amount?: number | null
          payment_screenshot_url?: string | null
          phone?: string | null
          project_name?: string | null
          rating?: number
          service_provided?: string | null
          share_publicly?: string | null
          submitted_at?: string | null
          suggestions?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          designation: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          website?: string | null
        }
        Relationships: []
      }
      dispatch_records: {
        Row: {
          created_at: string | null
          dispatch_date_time: string
          id: string
          notes: string | null
          planning_id: string | null
          status: string
          supervisor_contact: string
          supervisor_name: string
          updated_at: string | null
          vehicle_number: string
          warehouse_entries: Json | null
        }
        Insert: {
          created_at?: string | null
          dispatch_date_time: string
          id?: string
          notes?: string | null
          planning_id?: string | null
          status?: string
          supervisor_contact: string
          supervisor_name: string
          updated_at?: string | null
          vehicle_number: string
          warehouse_entries?: Json | null
        }
        Update: {
          created_at?: string | null
          dispatch_date_time?: string
          id?: string
          notes?: string | null
          planning_id?: string | null
          status?: string
          supervisor_contact?: string
          supervisor_name?: string
          updated_at?: string | null
          vehicle_number?: string
          warehouse_entries?: Json | null
        }
        Relationships: []
      }
      planning_schedules: {
        Row: {
          createdAt: string | null
          customerNameLocation: string
          driverPhone: string | null
          id: string
          loadingType: string
          scheduleDateTime: string
          scheduleNumber: string
          transporter: string
          updatedAt: string | null
          vehicleNumber: string
          warehouseAllotments: Json
        }
        Insert: {
          createdAt?: string | null
          customerNameLocation: string
          driverPhone?: string | null
          id?: string
          loadingType: string
          scheduleDateTime: string
          scheduleNumber: string
          transporter: string
          updatedAt?: string | null
          vehicleNumber: string
          warehouseAllotments?: Json
        }
        Update: {
          createdAt?: string | null
          customerNameLocation?: string
          driverPhone?: string | null
          id?: string
          loadingType?: string
          scheduleDateTime?: string
          scheduleNumber?: string
          transporter?: string
          updatedAt?: string | null
          vehicleNumber?: string
          warehouseAllotments?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          backlogs_count: number | null
          cgpa_percentage: string
          college_id_path: string | null
          college_name: string
          contact_agreed: boolean
          created_at: string
          current_year: string
          department: string
          email: string
          full_name: string
          gender: string
          github_portfolio_url: string
          has_backlogs: boolean
          id: string
          info_accurate_confirmed: boolean
          internship_duration: string
          mobile_number: string
          payment_option: string
          payment_screenshot_path: string | null
          preferred_domain: string
          preferred_start_date: string
          resume_path: string | null
          roll_number: string
          status: string | null
        }
        Insert: {
          backlogs_count?: number | null
          cgpa_percentage: string
          college_id_path?: string | null
          college_name: string
          contact_agreed?: boolean
          created_at?: string
          current_year: string
          department: string
          email: string
          full_name: string
          gender: string
          github_portfolio_url: string
          has_backlogs?: boolean
          id?: string
          info_accurate_confirmed?: boolean
          internship_duration: string
          mobile_number: string
          payment_option: string
          payment_screenshot_path?: string | null
          preferred_domain: string
          preferred_start_date: string
          resume_path?: string | null
          roll_number: string
          status?: string | null
        }
        Update: {
          backlogs_count?: number | null
          cgpa_percentage?: string
          college_id_path?: string | null
          college_name?: string
          contact_agreed?: boolean
          created_at?: string
          current_year?: string
          department?: string
          email?: string
          full_name?: string
          gender?: string
          github_portfolio_url?: string
          has_backlogs?: boolean
          id?: string
          info_accurate_confirmed?: boolean
          internship_duration?: string
          mobile_number?: string
          payment_option?: string
          payment_screenshot_path?: string | null
          preferred_domain?: string
          preferred_start_date?: string
          resume_path?: string | null
          roll_number?: string
          status?: string | null
        }
        Relationships: []
      }
      truck_schedules: {
        Row: {
          contractor_name: string
          created_at: string | null
          current_status: string | null
          customer_name: string | null
          end_time: string | null
          gate_in_time: string | null
          gate_out_time: string | null
          id: string
          kata_in_time: string | null
          kata_out_time: string | null
          loading_from: string | null
          loading_time: string | null
          party_name: string | null
          received_time: string | null
          remark: string | null
          schedule_number: string
          schedule_time: string
          start_time: string | null
          station: string | null
          transport_name: string | null
          truck_number: string
          warehouse_name: string
        }
        Insert: {
          contractor_name: string
          created_at?: string | null
          current_status?: string | null
          customer_name?: string | null
          end_time?: string | null
          gate_in_time?: string | null
          gate_out_time?: string | null
          id?: string
          kata_in_time?: string | null
          kata_out_time?: string | null
          loading_from?: string | null
          loading_time?: string | null
          party_name?: string | null
          received_time?: string | null
          remark?: string | null
          schedule_number: string
          schedule_time: string
          start_time?: string | null
          station?: string | null
          transport_name?: string | null
          truck_number: string
          warehouse_name: string
        }
        Update: {
          contractor_name?: string
          created_at?: string | null
          current_status?: string | null
          customer_name?: string | null
          end_time?: string | null
          gate_in_time?: string | null
          gate_out_time?: string | null
          id?: string
          kata_in_time?: string | null
          kata_out_time?: string | null
          loading_from?: string | null
          loading_time?: string | null
          party_name?: string | null
          received_time?: string | null
          remark?: string | null
          schedule_number?: string
          schedule_time?: string
          start_time?: string | null
          station?: string | null
          transport_name?: string | null
          truck_number?: string
          warehouse_name?: string
        }
        Relationships: []
      }
      weighbridge_records: {
        Row: {
          created_at: string | null
          driver_phone: string
          empty_vehicle_weight: number
          id: string
          schedule_number: string | null
          updated_at: string | null
          vehicle_gross_weight: number | null
          vehicle_net_weight: number | null
          vehicle_number: string
          wb_in_datetime: string
          wb_out_time: string | null
        }
        Insert: {
          created_at?: string | null
          driver_phone: string
          empty_vehicle_weight: number
          id?: string
          schedule_number?: string | null
          updated_at?: string | null
          vehicle_gross_weight?: number | null
          vehicle_net_weight?: number | null
          vehicle_number: string
          wb_in_datetime: string
          wb_out_time?: string | null
        }
        Update: {
          created_at?: string | null
          driver_phone?: string
          empty_vehicle_weight?: number
          id?: string
          schedule_number?: string | null
          updated_at?: string | null
          vehicle_gross_weight?: number | null
          vehicle_net_weight?: number | null
          vehicle_number?: string
          wb_in_datetime?: string
          wb_out_time?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      planning_schedules_with_trips: {
        Row: {
          createdAt: string | null
          customerNameLocation: string | null
          driverPhone: string | null
          expected_trips: number | null
          id: string | null
          is_trip_based_structure: boolean | null
          loadingType: string | null
          scheduleDateTime: string | null
          scheduleNumber: string | null
          transporter: string | null
          updatedAt: string | null
          vehicleNumber: string | null
          warehouseAllotments: Json | null
        }
        Insert: {
          createdAt?: string | null
          customerNameLocation?: string | null
          driverPhone?: string | null
          expected_trips?: never
          id?: string | null
          is_trip_based_structure?: never
          loadingType?: string | null
          scheduleDateTime?: string | null
          scheduleNumber?: string | null
          transporter?: string | null
          updatedAt?: string | null
          vehicleNumber?: string | null
          warehouseAllotments?: Json | null
        }
        Update: {
          createdAt?: string | null
          customerNameLocation?: string | null
          driverPhone?: string | null
          expected_trips?: never
          id?: string | null
          is_trip_based_structure?: never
          loadingType?: string | null
          scheduleDateTime?: string | null
          scheduleNumber?: string | null
          transporter?: string | null
          updatedAt?: string | null
          vehicleNumber?: string | null
          warehouseAllotments?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      extract_dispatch_entries_for_trip: {
        Args: { planning_allotments: Json; trip_num?: number }
        Returns: Json
      }
      get_trip_assignments: {
        Args: { allotments: Json; trip_num: number }
        Returns: Json
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      insert_dispatch_record: {
        Args: {
          p_contact_number: string
          p_date: string
          p_schedule_number: string
          p_status?: string
          p_supervisor_name: string
          p_vehicle_number: string
          p_warehouse_entries: Json
        }
        Returns: string
      }
      insert_planning_schedule: {
        Args: {
          p_contractor: string
          p_contractor_details: Json
          p_customer_name_location: string
          p_loading_type: string
          p_schedule_datetime: string
          p_schedule_number: string
          p_status?: string
          p_transporter: string
          p_vehicle_number: string
          p_warehouse_alloted: string
        }
        Returns: string
      }
      insert_weighbridge_record: {
        Args:
          | {
              p_driver_phone?: string
              p_empty_vehicle_weight: number
              p_schedule_number?: string
              p_vehicle_gross_weight: number
              p_vehicle_number: string
              p_wb_in_datetime: string
              p_wb_out_time: string
            }
          | {
              p_empty_vehicle_weight: number
              p_schedule_number?: string
              p_vehicle_gross_weight: number
              p_vehicle_number: string
              p_wb_in_datetime: string
              p_wb_out_time: string
            }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_embeddings: {
        Args: {
          match_count: number
          match_threshold: number
          p_agent_id: string
          p_user_id: string
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      validate_warehouse_allotments: {
        Args: { allotments: Json }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
