from marshmallow import Schema, fields, validate, validates, ValidationError
import re

class CustomerSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True, validate=validate.Length(max=120))
    phone = fields.String(required=True, validate=validate.Regexp(
        regex=r'^[+]?[\d\s\-\(\)]{10,}$',
        error='Invalid phone format'
    ))
    address = fields.String(required=True, validate=validate.Length(min=5, max=255))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates('email')
    def validate_email_domain(self, value):
        # Additional email validation
        domains_to_block = ['tempmail.com', 'throwaway.email']
        domain = value.split('@')[-1]
        if domain in domains_to_block:
            raise ValidationError('Email domain is not allowed')

    @validates('phone')
    def validate_phone_format(self, value):
        # Remove all non-digit characters for validation
        digits_only = re.sub(r'\D', '', value)
        if len(digits_only) < 10:
            raise ValidationError('Phone number must have at least 10 digits')
