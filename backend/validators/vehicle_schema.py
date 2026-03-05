from marshmallow import Schema, fields, validate, validates, ValidationError

class VehicleSchema(Schema):
    id = fields.Integer(dump_only=True)
    customer_id = fields.Integer(required=True, validate=validate.Range(min=1))
    make = fields.String(required=True, validate=validate.Length(min=2, max=50))
    model = fields.String(required=True, validate=validate.Length(min=2, max=50))
    year = fields.Integer(required=True, validate=validate.Range(min=1900, max=2100))
    license_plate = fields.String(required=True, validate=validate.Length(min=3, max=20))
    vin = fields.String(validate=validate.Length(equal=17))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates('vin')
    def validate_vin_checksum(self, value):
        if value:
            # Basic VIN validation - can be enhanced with actual checksum algorithm
            if not value.isalnum():
                raise ValidationError('VIN must contain only alphanumeric characters')
            
            # Check for common invalid patterns
            if value in ['12345678901234567', 'ABCDEFGHIJKLMNOP']:
                raise ValidationError('Invalid VIN pattern')
