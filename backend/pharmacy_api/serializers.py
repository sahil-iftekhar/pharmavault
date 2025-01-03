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
    OrderedPrescriptionImage,
    Payment,
    Cart
)


class UserSerializer(serializers.ModelSerializer):
    """User Serializer."""
    
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'name', 'password', 'phone', 'address',
                  'is_active', 'is_staff', 'is_superuser', 'slug']
        read_only_fields = ['id', 'is_superuser']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'}
            }
        }
        
    def create(self, validated_data):
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
        
    def create(self, validated_data):
        password = validated_data['password']
        customer = Customer.objects.create(**validated_data)
        if password:
            customer.set_password(password)
            customer.save()
        
        return customer
        
class EmployeeSerializer(UserSerializer):
    """Employee Serializer."""
    
    class Meta(UserSerializer.Meta):
        model = Employee
        
    def create(self, validated_data):
        password = validated_data['password']
        customer = Employee.objects.create(**validated_data)
        if password:
            customer.set_password(password)
            customer.save()
        
        return customer
        
class SupplierSerializer(UserSerializer):
    """Supplier Serializer."""
    
    class Meta(UserSerializer.Meta):
        model = Supplier
        
    def create(self, validated_data):
        password = validated_data['password']
        customer = Supplier.objects.create(**validated_data)
        if password:
            customer.set_password(password)
            customer.save()
        
        return customer
        
class MedicineSerializer(serializers.ModelSerializer):
    """Medicine Serializer."""
    
    class Meta:
        model = Medicine
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
        model = OrderedPrescriptionImage
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
        
class OrderSerializer(serializers.ModelSerializer):
    """Order Serializer."""
    medicines = OrderedMedicineSerializer(many=True, required=False)
    prescription_images = PrescriptionImageSerializer(many=True, required=False)
    
    class Meta:
        model = Order
        fields = ['id', 'customer', 'active', 'status', 'placed_date', 
                  'delivery_date', 'delivery_type', 'medicines', 
                  'prescription_images', 'slug']
        read_only_fields = ['id']
        
    def validate_delivery_date(self, value):
        """Ensure delivery_date is not earlier than placed_date"""
        if value < self.instance.placed_date:
            raise serializers.ValidationError("Delivery date cannot be earlier than the placed date.")
        return value
        
    def _get_or_create_medicines(self, medicines, order):
        """Handle getting or creating medicines as needed."""
        for medicine in medicines:
            medicine_obj, _ = Medicine.objects.get_or_create(
                **medicine
            )
            order.medicines.add(medicine_obj)
            
    def _get_or_create_prescription_images(self, prescription_images, order):
        """Handle getting or creating prescription images as needed."""
        for prescription_image in prescription_images:
            prescription_image_obj, _ = OrderedPrescriptionImage.objects.get_or_create(
                **prescription_image
            )
            order.prescription_images.add(prescription_image_obj)
            
    def create(self, validated_data):
        medicines = validated_data.pop('medicines', [])
        prescription_images = validated_data.pop('prescription_images', [])
        order = Order.objects.create(**validated_data)
        self._get_or_create_medicines(medicines, order)
        self._get_or_create_prescription_images(prescription_images, order)
        
        order.save()
        return order
    
    def update(self, instance, validated_data):
        medicines = validated_data.pop('medicines', [])
        prescription_images = validated_data.pop('prescription_images', [])
        instance = super().update(instance, validated_data)
        
        if medicines:
            instance.medicines.clear()
            self._get_or_create_medicines(medicines, instance)
            
        if prescription_images:
            instance.prescription_images.clear()
            self._get_or_create_prescription_images(prescription_images, instance)
        
        instance.save()
        return instance
        
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