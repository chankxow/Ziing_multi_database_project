from typing import List, Optional
from models.work_order import WorkOrder
from database import query, execute
from datetime import datetime
import logging

class WorkOrderService:
    @staticmethod
    def get_all_work_orders() -> List[WorkOrder]:
        try:
            result = query("SELECT * FROM work_orders ORDER BY created_at DESC")
            work_orders = []
            for row in result:
                work_order = WorkOrder(
                    id=row[0],
                    customer_id=row[1],
                    vehicle_id=row[2],
                    description=row[3],
                    status=row[4],
                    total_cost=row[5],
                    parts_used=row[6].split(',') if row[6] else [],
                    labor_hours=row[7],
                    created_at=row[8],
                    updated_at=row[9],
                    completed_at=row[10]
                )
                work_orders.append(work_order)
            return work_orders
        except Exception as e:
            logging.error(f"Error fetching work orders: {str(e)}")
            raise

    @staticmethod
    def get_work_order_by_id(work_order_id: int) -> Optional[WorkOrder]:
        try:
            result = query("SELECT * FROM work_orders WHERE id = %s", (work_order_id,))
            if result:
                row = result[0]
                return WorkOrder(
                    id=row[0],
                    customer_id=row[1],
                    vehicle_id=row[2],
                    description=row[3],
                    status=row[4],
                    total_cost=row[5],
                    parts_used=row[6].split(',') if row[6] else [],
                    labor_hours=row[7],
                    created_at=row[8],
                    updated_at=row[9],
                    completed_at=row[10]
                )
            return None
        except Exception as e:
            logging.error(f"Error fetching work order {work_order_id}: {str(e)}")
            raise

    @staticmethod
    def get_work_orders_by_customer(customer_id: int) -> List[WorkOrder]:
        try:
            result = query("SELECT * FROM work_orders WHERE customer_id = %s ORDER BY created_at DESC", (customer_id,))
            work_orders = []
            for row in result:
                work_order = WorkOrder(
                    id=row[0],
                    customer_id=row[1],
                    vehicle_id=row[2],
                    description=row[3],
                    status=row[4],
                    total_cost=row[5],
                    parts_used=row[6].split(',') if row[6] else [],
                    labor_hours=row[7],
                    created_at=row[8],
                    updated_at=row[9],
                    completed_at=row[10]
                )
                work_orders.append(work_order)
            return work_orders
        except Exception as e:
            logging.error(f"Error fetching work orders for customer {customer_id}: {str(e)}")
            raise

    @staticmethod
    def create_work_order(work_order_data: dict) -> WorkOrder:
        try:
            now = datetime.now()
            parts_str = ','.join(work_order_data.get('parts_used', []))
            query_str = """
                INSERT INTO work_orders (customer_id, vehicle_id, description, status, total_cost, parts_used, labor_hours, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            execute(query_str, (
                work_order_data['customer_id'],
                work_order_data['vehicle_id'],
                work_order_data['description'],
                work_order_data.get('status', 'pending'),
                work_order_data.get('total_cost', 0.0),
                parts_str,
                work_order_data.get('labor_hours', 0.0),
                now,
                now
            ))
            
            # Get the created work order
            result = query("SELECT LAST_INSERT_ID()")
            work_order_id = result[0][0]
            
            return WorkOrderService.get_work_order_by_id(work_order_id)
        except Exception as e:
            logging.error(f"Error creating work order: {str(e)}")
            raise

    @staticmethod
    def update_work_order(work_order_id: int, work_order_data: dict) -> Optional[WorkOrder]:
        try:
            now = datetime.now()
            parts_str = ','.join(work_order_data.get('parts_used', []))
            completed_at = now if work_order_data.get('status') == 'completed' else None
            
            query_str = """
                UPDATE work_orders 
                SET customer_id = %s, vehicle_id = %s, description = %s, status = %s, 
                    total_cost = %s, parts_used = %s, labor_hours = %s, updated_at = %s, completed_at = %s
                WHERE id = %s
            """
            execute(query_str, (
                work_order_data['customer_id'],
                work_order_data['vehicle_id'],
                work_order_data['description'],
                work_order_data['status'],
                work_order_data['total_cost'],
                parts_str,
                work_order_data['labor_hours'],
                now,
                completed_at,
                work_order_id
            ))
            
            return WorkOrderService.get_work_order_by_id(work_order_id)
        except Exception as e:
            logging.error(f"Error updating work order {work_order_id}: {str(e)}")
            raise

    @staticmethod
    def delete_work_order(work_order_id: int) -> bool:
        try:
            execute("DELETE FROM work_orders WHERE id = %s", (work_order_id,))
            return True
        except Exception as e:
            logging.error(f"Error deleting work order {work_order_id}: {str(e)}")
            raise
