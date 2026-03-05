export interface Vehicle {
  id: number
  customer_id: number
  make: string
  model: string
  year: number
  license_plate: string
  vin: string
  created_at: string
  updated_at: string
}

export interface CreateVehicleRequest {
  customer_id: number
  make: string
  model: string
  year: number
  license_plate: string
  vin: string
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {}
