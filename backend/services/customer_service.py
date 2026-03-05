from typing import List, Optional
from models.customer import Customer
from database import query, execute
from datetime import datetime
import logging

class CustomerService:
    @staticmethod
    def get_all_customers() -> List[Customer]:
        try:
            result = query("SELECT * FROM Customer ORDER BY CreatedDate DESC")
            customers = []
            for row in result:
                customer = Customer(
                    id=row['CustomerID'],
                    name=row['FirstName'] + ' ' + (row['LastName'] if row['LastName'] else ''),
                    email=row['Email'] if 'Email' in row else '',
                    phone=row['Phone'] if 'Phone' in row else '',
                    address='',  # Database doesn't have address column
                    created_at=row['CreatedDate'] if 'CreatedDate' in row else None,
                    updated_at=None
                )
                customers.append(customer)
            return customers
        except Exception as e:
            logging.error(f"Error fetching customers: {str(e)}")
            raise

    @staticmethod
    def get_customer_by_id(customer_id: int) -> Optional[Customer]:
        try:
            result = query("SELECT * FROM Customer WHERE CustomerID = %s", (customer_id,))
            if result:
                row = result[0]  # This is a dictionary now
                return Customer(
                    id=row['CustomerID'],
                    name=row['FirstName'] + ' ' + (row['LastName'] if row['LastName'] else ''),
                    email=row['Email'] if 'Email' in row else '',
                    phone=row['Phone'] if 'Phone' in row else '',
                    address='',  # Database doesn't have address column
                    created_at=row['CreatedDate'] if 'CreatedDate' in row else None,
                    updated_at=None
                )
            return None
        except Exception as e:
            logging.error(f"Error fetching customer {customer_id}: {str(e)}")
            raise

    @staticmethod
    def create_customer(customer_data: dict) -> Customer:
        try:
            now = datetime.now()
            # Split name into first and last name
            name_parts = customer_data['name'].split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            query_str = """
                INSERT INTO Customer (FirstName, LastName, Phone, Email)
                VALUES (%s, %s, %s, %s)
            """
            # Use query and get the last_insert_id directly
            customer_id = query(query_str, (
                first_name,
                last_name,
                customer_data['phone'],
                customer_data['email']
            ))
            
            return CustomerService.get_customer_by_id(customer_id)
        except Exception as e:
            logging.error(f"Error creating customer: {str(e)}")
            raise

    @staticmethod
    def update_customer(customer_id: int, customer_data: dict) -> Optional[Customer]:
        try:
            now = datetime.now()
            query_str = """
                UPDATE customers 
                SET name = %s, email = %s, phone = %s, address = %s, updated_at = %s
                WHERE id = %s
            """
            execute(query_str, (
                customer_data['name'],
                customer_data['email'],
                customer_data['phone'],
                customer_data['address'],
                now,
                customer_id
            ))
            
            return CustomerService.get_customer_by_id(customer_id)
        except Exception as e:
            logging.error(f"Error updating customer {customer_id}: {str(e)}")
            raise

    @staticmethod
    def delete_customer(customer_id: int) -> bool:
        try:
            execute("DELETE FROM customers WHERE id = %s", (customer_id,))
            return True
        except Exception as e:
            logging.error(f"Error deleting customer {customer_id}: {str(e)}")
            raise
