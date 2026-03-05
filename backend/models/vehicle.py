from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class Vehicle:
    id: Optional[int] = None
    customer_id: int = 0
    make: str = ""
    model: str = ""
    year: int = 0
    license_plate: str = ""
    vin: str = ""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'license_plate': self.license_plate,
            'vin': self.vin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data.get('id'),
            customer_id=data.get('customer_id', 0),
            make=data.get('make', ''),
            model=data.get('model', ''),
            year=data.get('year', 0),
            license_plate=data.get('license_plate', ''),
            vin=data.get('vin', ''),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None
        )
