export interface Part {
  _id: string
  name: string
  description: string
  price: number
  quantity: number
  supplier: string
  part_number: string
  category: string
  compatibility: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreatePartRequest {
  name: string
  description?: string
  price: number
  quantity: number
  supplier?: string
  part_number?: string
  category?: string
  compatibility?: Record<string, any>
}

export interface UpdatePartRequest extends Partial<CreatePartRequest> {}
