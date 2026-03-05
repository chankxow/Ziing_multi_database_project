from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime

@dataclass
class Part:
    id: Optional[str] = None
    name: str = ""
    description: str = ""
    price: float = 0.0
    quantity: int = 0
    supplier: str = ""
    part_number: str = ""
    category: str = ""
    compatibility: Dict[str, Any] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        if self.compatibility is None:
            self.compatibility = {}

    def to_dict(self):
        return {
            '_id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'quantity': self.quantity,
            'supplier': self.supplier,
            'part_number': self.part_number,
            'category': self.category,
            'compatibility': self.compatibility,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data.get('_id'),
            name=data.get('name', ''),
            description=data.get('description', ''),
            price=data.get('price', 0.0),
            quantity=data.get('quantity', 0),
            supplier=data.get('supplier', ''),
            part_number=data.get('part_number', ''),
            category=data.get('category', ''),
            compatibility=data.get('compatibility', {}),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None
        )
