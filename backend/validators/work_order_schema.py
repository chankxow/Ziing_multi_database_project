from marshmallow import Schema, fields, validate, validates, ValidationError
from enum import Enum

class WorkOrderStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class WorkOrderSchema(Schema):
    id = fields.Integer(dump_only=True)
    customer_id = fields.Integer(required=True, validate=validate.Range(min=1))
    vehicle_id = fields.Integer(required=True, validate=validate.Range(min=1))
    description = fields.String(required=True, validate=validate.Length(min=10, max=1000))
    status = fields.String(validate=validate.OneOf([e.value for e in WorkOrderStatus]))
    total_cost = fields.Float(validate=validate.Range(min=0))
    parts_used = fields.List(fields.String())
    labor_hours = fields.Float(validate=validate.Range(min=0))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    completed_at = fields.DateTime(dump_only=True)

    @validates('total_cost')
    def validate_total_cost(self, value):
        if value and value > 100000:  # Reasonable upper limit
            raise ValidationError('Total cost seems unusually high')

    @validates('labor_hours')
    def validate_labor_hours(self, value):
        if value and value > 100:  # Reasonable upper limit for labor hours
            raise ValidationError('Labor hours seem unusually high')
