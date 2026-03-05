from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime

@dataclass
class WorkOrder:
    id: Optional[int] = None
    customer_id: int = 0
    vehicle_id: int = 0
    description: str = ""
    status: str = "pending"
    total_cost: float = 0.0
    parts_used: List[str] = None
    labor_hours: float = 0.0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    def __post_init__(self):
        if self.parts_used is None:
            self.parts_used = []

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'vehicle_id': self.vehicle_id,
            'description': self.description,
            'status': self.status,
            'total_cost': self.total_cost,
            'parts_used': self.parts_used,
            'labor_hours': self.labor_hours,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data.get('id'),
            customer_id=data.get('customer_id', 0),
            vehicle_id=data.get('vehicle_id', 0),
            description=data.get('description', ''),
            status=data.get('status', 'pending'),
            total_cost=data.get('total_cost', 0.0),
            parts_used=data.get('parts_used', []),
            labor_hours=data.get('labor_hours', 0.0),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None,
            completed_at=datetime.fromisoformat(data['completed_at']) if data.get('completed_at') else None
        )
