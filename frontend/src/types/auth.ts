export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'manager' | 'mechanic' | 'customer'
  customer_id?: number
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}
