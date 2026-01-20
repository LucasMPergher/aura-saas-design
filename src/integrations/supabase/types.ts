/**
 * Database types for Supabase
 * 
 * Este archivo se puede autogenerar con:
 * npx supabase gen types typescript --project-id "tu-project-ref" --schema public > src/integrations/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Define tus tablas aquí
      // Ejemplo:
      // perfumes: {
      //   Row: {
      //     id: string
      //     name: string
      //     brand: string
      //     price: number
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     name: string
      //     brand: string
      //     price: number
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     name?: string
      //     brand?: string
      //     price?: number
      //     created_at?: string
      //   }
      // }
    }
    Views: {
      // Define tus vistas aquí
    }
    Functions: {
      // Define tus funciones aquí
    }
    Enums: {
      // Define tus enums aquí
    }
  }
}
