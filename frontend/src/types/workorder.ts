export interface WorkOrder {
  id: number
  customer_id: number
  vehicle_id: number
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  total_cost: number
  parts_used: string[]
  labor_hours: number
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface CreateWorkOrderRequest {
  customer_id: number
  vehicle_id: number
  description: string
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  total_cost?: number
  parts_used?: string[]
  labor_hours?: number
}

export interface UpdateWorkOrderRequest extends Partial<CreateWorkOrderRequest> {}
