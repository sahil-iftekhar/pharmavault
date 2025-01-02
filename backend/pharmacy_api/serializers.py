"""Serializers For Blog API."""
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import (
    Medicine,
    Customer,
    Employee,
    Supplier,
    Medicine,
    Order,
    Supply,
    Feedback,
    OrderedMedicine,
    PrescriptionImage,
    Payment,
    Cart
)


class UserSerializer(serializers.ModelSerializer):
    """User Serializer."""
    
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'name', 'password', 'phone', 'address',
                  'is_active', 'is_staff', 'slug']
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'}
            }
        }
        
    def create(self, validated_data):
        print(validated_data)
        return get_user_model().objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
            
        return instance
    
class CustomerSerializer(UserSerializer):
    """Customer Serializer."""
    
    class Meta(UserSerializer.Meta):
        model = Customer
        
class EmployeeSerializer(UserSerializer):
    """Employee Serializer."""
    
    class Meta(UserSerializer.Meta):
        model = Employee
        
class SupplierSerializer(UserSerializer):
    """Supplier Serializer."""
    
    class Meta(UserSerializer.Meta):
        model = Supplier
        
class MedicineSerializer(serializers.ModelSerializer):
    """Medicine Serializer."""
    
    class Meta:
        model = Medicine
        fields = '__all__'
        read_only_fields = ['id']
        
class OrderSerializer(serializers.ModelSerializer):
    """Order Serializer."""
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['id']
        
class SupplySerializer(serializers.ModelSerializer):
    """Supply Serializer."""
    
    class Meta:
        model = Supply
        fields = '__all__'
        read_only_fields = ['id']
        
class FeedbackSerializer(serializers.ModelSerializer):
    """Feedback Serializer."""
    
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['id']
        
class OrderedMedicineSerializer(serializers.ModelSerializer):
    """Ordered Medicine Serializer."""
    
    class Meta:
        model = OrderedMedicine
        fields = '__all__'
        read_only_fields = ['id']
        
class PrescriptionImageSerializer(serializers.ModelSerializer):
    """Prescription Serializer."""
    
    class Meta:
        model = PrescriptionImage
        fields = '__all__'
        read_only_fields = ['id']
        
    def validate_prescription_image(self, value):
        max_size = 5 * 1024 * 1024
        valid_file_types = ['image/jpeg', 'image/png']
        
        if value.size > max_size:
            raise serializers.ValidationError('File size must be less than 5MB.')
        
        if value.content_type not in valid_file_types:
            raise serializers.ValidationError('File type must be JPEG or PNG.')
        
        return value
    
class PaymentSerializer(serializers.ModelSerializer):
    """Payment Serializer."""
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id']
        
class CartSerializer(serializers.ModelSerializer):
    """Cart Serializer."""
    
    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['id']