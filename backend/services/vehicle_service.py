from typing import List, Optional
from models.vehicle import Vehicle
from database import query, execute
from datetime import datetime
import logging

class VehicleService:
    @staticmethod
    def get_all_vehicles() -> List[Vehicle]:
        try:
            result = query("SELECT * FROM vehicles ORDER BY created_at DESC")
            vehicles = []
            for row in result:
                vehicle = Vehicle(
                    id=row[0],
                    customer_id=row[1],
                    make=row[2],
                    model=row[3],
                    year=row[4],
                    license_plate=row[5],
                    vin=row[6],
                    created_at=row[7],
                    updated_at=row[8]
                )
                vehicles.append(vehicle)
            return vehicles
        except Exception as e:
            logging.error(f"Error fetching vehicles: {str(e)}")
            raise

    @staticmethod
    def get_vehicle_by_id(vehicle_id: int) -> Optional[Vehicle]:
        try:
            result = query("SELECT * FROM vehicles WHERE id = %s", (vehicle_id,))
            if result:
                row = result[0]
                return Vehicle(
                    id=row[0],
                    customer_id=row[1],
                    make=row[2],
                    model=row[3],
                    year=row[4],
                    license_plate=row[5],
                    vin=row[6],
                    created_at=row[7],
                    updated_at=row[8]
                )
            return None
        except Exception as e:
            logging.error(f"Error fetching vehicle {vehicle_id}: {str(e)}")
            raise

    @staticmethod
    def get_vehicles_by_customer(customer_id: int) -> List[Vehicle]:
        try:
            result = query("SELECT * FROM vehicles WHERE customer_id = %s ORDER BY created_at DESC", (customer_id,))
            vehicles = []
            for row in result:
                vehicle = Vehicle(
                    id=row[0],
                    customer_id=row[1],
                    make=row[2],
                    model=row[3],
                    year=row[4],
                    license_plate=row[5],
                    vin=row[6],
                    created_at=row[7],
                    updated_at=row[8]
                )
                vehicles.append(vehicle)
            return vehicles
        except Exception as e:
            logging.error(f"Error fetching vehicles for customer {customer_id}: {str(e)}")
            raise

    @staticmethod
    def create_vehicle(vehicle_data: dict) -> Vehicle:
        try:
            now = datetime.now()
            query_str = """
                INSERT INTO vehicles (customer_id, make, model, year, license_plate, vin, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            execute(query_str, (
                vehicle_data['customer_id'],
                vehicle_data['make'],
                vehicle_data['model'],
                vehicle_data['year'],
                vehicle_data['license_plate'],
                vehicle_data['vin'],
                now,
                now
            ))
            
            # Get the created vehicle
            result = query("SELECT LAST_INSERT_ID()")
            vehicle_id = result[0][0]
            
            return VehicleService.get_vehicle_by_id(vehicle_id)
        except Exception as e:
            logging.error(f"Error creating vehicle: {str(e)}")
            raise

    @staticmethod
    def update_vehicle(vehicle_id: int, vehicle_data: dict) -> Optional[Vehicle]:
        try:
            now = datetime.now()
            query_str = """
                UPDATE vehicles 
                SET customer_id = %s, make = %s, model = %s, year = %s, 
                    license_plate = %s, vin = %s, updated_at = %s
                WHERE id = %s
            """
            execute(query_str, (
                vehicle_data['customer_id'],
                vehicle_data['make'],
                vehicle_data['model'],
                vehicle_data['year'],
                vehicle_data['license_plate'],
                vehicle_data['vin'],
                now,
                vehicle_id
            ))
            
            return VehicleService.get_vehicle_by_id(vehicle_id)
        except Exception as e:
            logging.error(f"Error updating vehicle {vehicle_id}: {str(e)}")
            raise

    @staticmethod
    def delete_vehicle(vehicle_id: int) -> bool:
        try:
            execute("DELETE FROM vehicles WHERE id = %s", (vehicle_id,))
            return True
        except Exception as e:
            logging.error(f"Error deleting vehicle {vehicle_id}: {str(e)}")
            raise
