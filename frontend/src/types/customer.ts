export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone: string
  address: string
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}
