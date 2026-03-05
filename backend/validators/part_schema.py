from marshmallow import Schema, fields, validate, validates, ValidationError

class PartSchema(Schema):
    id = fields.String(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    description = fields.String(validate=validate.Length(max=500))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    quantity = fields.Integer(required=True, validate=validate.Range(min=0))
    supplier = fields.String(validate=validate.Length(max=100))
    part_number = fields.String(validate=validate.Length(min=3, max=50))
    category = fields.String(validate=validate.Length(max=50))
    compatibility = fields.Dict()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates('price')
    def validate_price(self, value):
        if value and value > 10000:  # Reasonable upper limit for parts
            raise ValidationError('Part price seems unusually high')

    @validates('quantity')
    def validate_quantity(self, value):
        if value and value > 10000:  # Reasonable upper limit for inventory
            raise ValidationError('Quantity seems unusually high')

    @validates('part_number')
    def validate_part_number(self, value):
        if value:
            # Ensure part number is unique (placeholder validation)
            # In a real implementation, you would check against the database
            pass
