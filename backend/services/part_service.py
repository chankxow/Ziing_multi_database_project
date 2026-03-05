from typing import List, Optional
from models.part import Part
from database import get_parts_collection
from datetime import datetime
import logging

class PartService:
    @staticmethod
    def get_all_parts() -> List[Part]:
        try:
            collection = get_parts_collection()
            parts_data = collection.find({}).sort('created_at', -1)
            
            parts = []
            for part_data in parts_data:
                part = Part.from_dict(part_data)
                parts.append(part)
            return parts
        except Exception as e:
            logging.error(f"Error fetching parts: {str(e)}")
            raise

    @staticmethod
    def get_part_by_id(part_id: str) -> Optional[Part]:
        try:
            collection = get_parts_collection()
            part_data = collection.find_one({'_id': part_id})
            
            if part_data:
                return Part.from_dict(part_data)
            return None
        except Exception as e:
            logging.error(f"Error fetching part {part_id}: {str(e)}")
            raise

    @staticmethod
    def get_parts_by_category(category: str) -> List[Part]:
        try:
            collection = get_parts_collection()
            parts_data = collection.find({'category': category}).sort('created_at', -1)
            
            parts = []
            for part_data in parts_data:
                part = Part.from_dict(part_data)
                parts.append(part)
            return parts
        except Exception as e:
            logging.error(f"Error fetching parts for category {category}: {str(e)}")
            raise

    @staticmethod
    def search_parts(query_text: str) -> List[Part]:
        try:
            collection = get_parts_collection()
            # Simple text search - can be enhanced with MongoDB text indexes
            regex_query = {'$regex': query_text, '$options': 'i'}
            parts_data = collection.find({
                '$or': [
                    {'name': regex_query},
                    {'description': regex_query},
                    {'part_number': regex_query}
                ]
            }).sort('created_at', -1)
            
            parts = []
            for part_data in parts_data:
                part = Part.from_dict(part_data)
                parts.append(part)
            return parts
        except Exception as e:
            logging.error(f"Error searching parts with query '{query_text}': {str(e)}")
            raise

    @staticmethod
    def create_part(part_data: dict) -> Part:
        try:
            collection = get_parts_collection()
            now = datetime.now()
            
            part = Part(
                name=part_data['name'],
                description=part_data.get('description', ''),
                price=part_data.get('price', 0.0),
                quantity=part_data.get('quantity', 0),
                supplier=part_data.get('supplier', ''),
                part_number=part_data.get('part_number', ''),
                category=part_data.get('category', ''),
                compatibility=part_data.get('compatibility', {}),
                created_at=now,
                updated_at=now
            )
            
            # Generate a unique ID
            import uuid
            part.id = str(uuid.uuid4())
            
            part_dict = part.to_dict()
            collection.insert_one(part_dict)
            
            return part
        except Exception as e:
            logging.error(f"Error creating part: {str(e)}")
            raise

    @staticmethod
    def update_part(part_id: str, part_data: dict) -> Optional[Part]:
        try:
            collection = get_parts_collection()
            now = datetime.now()
            
            update_data = {
                'name': part_data['name'],
                'description': part_data.get('description', ''),
                'price': part_data.get('price', 0.0),
                'quantity': part_data.get('quantity', 0),
                'supplier': part_data.get('supplier', ''),
                'part_number': part_data.get('part_number', ''),
                'category': part_data.get('category', ''),
                'compatibility': part_data.get('compatibility', {}),
                'updated_at': now
            }
            
            collection.update_one({'_id': part_id}, {'$set': update_data})
            
            return PartService.get_part_by_id(part_id)
        except Exception as e:
            logging.error(f"Error updating part {part_id}: {str(e)}")
            raise

    @staticmethod
    def delete_part(part_id: str) -> bool:
        try:
            collection = get_parts_collection()
            collection.delete_one({'_id': part_id})
            return True
        except Exception as e:
            logging.error(f"Error deleting part {part_id}: {str(e)}")
            raise

    @staticmethod
    def update_inventory(part_id: str, quantity_change: int) -> Optional[Part]:
        try:
            collection = get_parts_collection()
            now = datetime.now()
            
            collection.update_one(
                {'_id': part_id}, 
                {
                    '$inc': {'quantity': quantity_change},
                    '$set': {'updated_at': now}
                }
            )
            
            return PartService.get_part_by_id(part_id)
        except Exception as e:
            logging.error(f"Error updating inventory for part {part_id}: {str(e)}")
            raise
