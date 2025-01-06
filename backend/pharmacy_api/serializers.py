"""Serializers For Blog API."""
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
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
    Cart,
    CartMedicine
)


class UserSerializer(serializers.ModelSerializer):
    """User Serializer."""
    
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'name', 'password', 'phone', 'address',
                  'is_active', 'is_staff', 'is_superuser', 'slug']
        read_only_fields = ['id', 'is_superuser', 'slug']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'}
            }
        }
# INSERT INTO auth_user (username, email, password, date_joined)
# VALUES ('testuser', 'test@example.com', 'hashed_password_here', '2025-01-07 12:00:00');
    def create(self, validated_data): 
        return get_user_model().objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):

# UPDATE User
# SET first_name = '<first_name>',
#     last_name = '<last_name>',
#     email = '<email>'
# WHERE id = <user_id>;

# IF '<new_password>' IS NOT NULL THEN
#     SET @hashed_password = hash_password('<new_password>');
    
#     UPDATE User
#     SET password = @hashed_password
#     WHERE id = <user_id>;
# END IF;

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
# INSERT INTO Customer (email, first_name, last_name)
# VALUES ('<email>', '<first_name>', '<last_name>');

# IF '<password>' IS NOT NULL THEN
#     SET @hashed_password = hash_password('<password>');
    
#     UPDATE Customer
#     SET password = @hashed_password
#     WHERE email = '<email>';
# END IF;

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
# INSERT INTO Employee (email, first_name, last_name)
# VALUES ('<email>', '<first_name>', '<last_name>');

# IF '<password>' IS NOT NULL THEN
#     SET @hashed_password = hash_password('<password>');
    
#     UPDATE Employee
#     SET password = @hashed_password
#     WHERE email = '<email>';
# END IF;

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
# INSERT INTO Supplier (email, first_name, last_name)
# VALUES ('<email>', '<first_name>', '<last_name>');


# IF '<password>' IS NOT NULL THEN
#     SET @hashed_password = hash_password('<password>');
    
#     UPDATE Supplier
#     SET password = @hashed_password
#     WHERE email = '<email>';
# END IF;

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
        read_only_fields = ['id', 'slug']
        
class OrderedMedicineSerializer(serializers.ModelSerializer):
    """Ordered Medicine Serializer."""
    
    class Meta:
        model = OrderedMedicine
        fields = '__all__'
        read_only_fields = ['id', 'order']
        
class PrescriptionImageSerializer(serializers.ModelSerializer):
    """Prescription Serializer."""
    
    class Meta:
        model = OrderedPrescriptionImage
        fields = '__all__'
        read_only_fields = ['id', 'order']
        
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
        read_only_fields = ['id', 'customer', 'placed_date', 'slug']
        
    def _get_or_create_medicines(self, medicines, order):
# DECLARE @medicine_id INT;

# SELECT @medicine_id = id
# FROM Medicine
# WHERE name = '<medicine_name>';

# IF @medicine_id IS NULL
# BEGIN
#     INSERT INTO ErrorResponse (error_message)
#     VALUES ('Medicine does not exist.');
#     -- Return to stop further processing
#     RETURN;
# END;

# INSERT INTO OrderedMedicine (order_id, medicine_id, quantity, dosage)
# VALUES (<order_id>, @medicine_id, <quantity>, <dosage>);

# INSERT INTO OrderMedicines (order_id, ordered_medicine_id)
# VALUES (<order_id>, LAST_INSERT_ID());

        """Handle getting or creating medicines as needed."""

        for medicine in medicines:
            medicine_name = medicine.pop('medicine')
            medicine_obj = Medicine.objects.get(name=medicine_name)
            print(medicine_obj)
            
            if medicine_obj is None:
                raise serializers.ValidationError("Medicine does not exist.")
            
            ordered_medicine_obj = OrderedMedicine.objects.create(
                order = order,
                medicine = medicine_obj,
                **medicine
            )
            print(ordered_medicine_obj)
            order.medicines.add(ordered_medicine_obj)
            
    def _get_or_create_prescription_images(self, prescription_images, order):
# DECLARE @prescription_image_id INT;

# INSERT INTO OrderedPrescriptionImage (order_id, image_field, other_field)
# VALUES (<order_id>, '<image_file>', '<other_field_value>');

# SET @prescription_image_id = LAST_INSERT_ID();

# INSERT INTO OrderPrescriptionImages (order_id, ordered_prescription_image_id)
# VALUES (<order_id>, @prescription_image_id);

        """Handle getting or creating prescription images as needed."""
        for prescription_image in prescription_images:
            prescription_image_obj = OrderedPrescriptionImage.objects.create(
                order = order,
                **prescription_image
            )
            order.prescription_images.add(prescription_image_obj)
            
    def create(self, validated_data):
# SELECT id
# FROM User
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM User WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('User is not authenticated.');
#     RETURN;
# END;

# SELECT id
# FROM Customer
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM Customer WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message)
#     VALUES ('Customer does not exist.');
#     RETURN;
# END;

# INSERT INTO Order (customer_id, other_order_fields)
# VALUES (<customer_id>, <other_order_values>);

# FOR EACH medicine IN medicines
# BEGIN
#     SELECT id
#     FROM Medicine
#     WHERE name = '<medicine_name>';

#     IF NOT EXISTS (SELECT 1 FROM Medicine WHERE name = '<medicine_name>')
#     BEGIN
#         INSERT INTO ErrorResponse (error_message)
#         VALUES ('Medicine does not exist.');
#         RETURN;
#     END;

#     INSERT INTO OrderedMedicine (order_id, medicine_id, quantity, dosage)
#     VALUES (<order_id>, <medicine_id>, <quantity>, <dosage>);
# END;

# COMMIT;

        medicines = validated_data.pop('medicines', [])
        prescription_images = validated_data.pop('prescription_images', [])
        user = self.context['request'].user
        
        if not user or not user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")
        
        customer = Customer.objects.get(email=user)
        
        if not customer:
            raise PermissionDenied("Customer does not exist.")
        
        validated_data['customer'] = customer
        order = Order.objects.create(**validated_data)
        self._get_or_create_medicines(medicines, order)
        self._get_or_create_prescription_images(prescription_images, order)
        
        
        order.save()
        return order
    
    def update(self, instance, validated_data):
# SELECT id
# FROM User
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM User WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('User is not authenticated.');
#     RETURN;
# END;

# UPDATE Order
# SET field1 = '<new_value1>', field2 = '<new_value2>'
# WHERE id = <order_id>;

# DELETE FROM OrderMedicines
# WHERE order_id = <order_id>;

# FOR EACH medicine IN medicines
# BEGIN
#     SELECT id
#     FROM Medicine
#     WHERE name = '<medicine_name>';

#     IF NOT EXISTS (SELECT 1 FROM Medicine WHERE name = '<medicine_name>')
#     BEGIN
#         INSERT INTO ErrorResponse (error_message)
#         VALUES ('Medicine does not exist.');
#         RETURN;
#     END;

#     INSERT INTO OrderedMedicine (order_id, medicine_id, quantity, dosage)
#     VALUES (<order_id>, <medicine_id>, <quantity>, <dosage>);
# END;

# DELETE FROM OrderPrescriptionImages
# WHERE order_id = <order_id>;
# COMMIT;

        medicines = validated_data.pop('medicines', [])
        prescription_images = validated_data.pop('prescription_images', [])
        user = self.context['request'].user
        
        if not user or not user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")
        
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
        fields = ['id', 'name', 'feedback_text', 'rating', 'created_at']
        read_only_fields = ['id', 'created_at']
        
    def create(self, validated_data):
# SELECT id
# FROM User
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM User WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('User is not authenticated.');
#     RETURN;
# END;

# INSERT INTO Order (customer_id, order_field1, order_field2, ...)
# VALUES (<customer_id>, '<order_value1>', '<order_value2>', ...);

        print('validated_data', validated_data)
        user = self.context['request'].user
        
        if not user or not user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
# SELECT id
# FROM User
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM User WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('User is not authenticated.');
#     RETURN;
# END;

# UPDATE Order
# SET field1 = '<new_value1>', field2 = '<new_value2>', ...
# WHERE id = <order_id>;
# COMMIT;

        user = self.context['request'].user
        
        if not user or not user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")
        
        instance = super().update(instance, validated_data)
        instance.save()
        return instance
    
class PaymentSerializer(serializers.ModelSerializer):
    """Payment Serializer."""
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id', 'customer', 'slug']
        
    def create(self, validated_data):
# SELECT id
# FROM User
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM User WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('User is not authenticated.');
#     RETURN;
# END;

# SELECT id
# FROM Customer
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM Customer WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('Customer does not exist.');
#     RETURN;
# END;

# INSERT INTO Order (customer_id, order_field1, order_field2, ...)
# VALUES (<customer_id>, '<order_value1>', '<order_value2>', ...);

        user = self.context['request'].user
        customer = Customer.objects.get(email=user)
        
        if not customer or not user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")
        
        validated_data['customer'] = customer
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        
        if not user or not user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")
        
        instance = super().update(instance, validated_data)
        instance.save()
        return instance
    
class CartMedicineSerializer(serializers.ModelSerializer):
    """Cart Medicine Serializer."""
    
    class Meta:
        model = CartMedicine
        fields = '__all__'
        read_only_fields = ['id', 'cart']  
    
class CartSerializer(serializers.ModelSerializer):
    """Cart Serializer."""
    medicines = CartMedicineSerializer(many=True, required=False)

    class Meta:
        model = Cart
        fields = ['id', 'customer', 'medicines', 'slug']
        read_only_fields = ['id', 'customer', 'slug']

    def _get_or_create_medicines(self, medicines, cart):
# FOR EACH medicine IN medicines LOOP
#     SET medicine_name = medicine.medicine;
#     SET medicine_quantity = CAST(medicine.quantity AS INT);
    
#     SELECT id
#     FROM Medicine
#     WHERE name = medicine_name;

#     IF NOT EXISTS (SELECT 1 FROM Medicine WHERE name = medicine_name) 
#     BEGIN
#         INSERT INTO ErrorResponse (error_message) 
#         VALUES ('Medicine does not exist.');
#         RETURN;
#     END;

#     SELECT id
#     FROM CartMedicine
#     WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>;

#     IF EXISTS (SELECT 1 FROM CartMedicine WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>) 
#     BEGIN
#         UPDATE CartMedicine
#         SET quantity = quantity + medicine_quantity
#         WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>;
#     END;
#     ELSE
#     BEGIN
#         INSERT INTO CartMedicine (cart_id, medicine_id, quantity)
#         VALUES (<cart_id>, <medicine_id>, medicine_quantity);
#     END;
# END;

        """Handle getting or creating medicines as needed."""
        for medicine in medicines:
            print('medicine', medicine)
            medicine['quantity'] = int(medicine['quantity'])
            medicine_name = medicine.pop('medicine')
            medicine_obj = Medicine.objects.get(name=medicine_name)
            
            if medicine_obj is None:
                raise serializers.ValidationError("Medicine does not exist.")
            
            if cart.medicines.filter(medicine=medicine_obj).exists():
                cart_medicine = cart.medicines.get(medicine=medicine_obj)
            else:
                cart_medicine = None
                
            if cart_medicine:
                cart_medicine.quantity += medicine['quantity']
                cart_medicine.save()
            else:
                cart_medicine_obj = CartMedicine.objects.create(
                    cart=cart,
                    medicine=medicine_obj,
                    **medicine
                )
                cart.medicines.add(cart_medicine_obj)

    def create(self, validated_data):
# SELECT id
# FROM User
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM User WHERE email = '<user_email>') 
# BEGIN
#     -- Raise a permission denied error
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('User is not authenticated.');
#     RETURN;
# END;

# SELECT id
# FROM Customer
# WHERE email = '<user_email>';

# -- If no customer exists for the given email, raise an error
# IF NOT EXISTS (SELECT 1 FROM Customer WHERE email = '<user_email>') 
# BEGIN
#     -- Raise customer not found error
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('Customer does not exist.');
#     RETURN;
# END;

# INSERT INTO Cart (customer_id, cart_field1, cart_field2, ...)
# VALUES (<customer_id>, '<cart_value1>', '<cart_value2>', ...);

# FOR EACH medicine IN medicines LOOP
#     SET medicine_name = medicine.medicine;
#     SET medicine_quantity = CAST(medicine.quantity AS INT);
    
#     SELECT id
#     FROM Medicine
#     WHERE name = medicine_name;

#     IF NOT EXISTS (SELECT 1 FROM Medicine WHERE name = medicine_name) 
#     BEGIN
#         INSERT INTO ErrorResponse (error_message) 
#         VALUES ('Medicine does not exist.');
#         RETURN;
#     END;

#     SELECT id
#     FROM CartMedicine
#     WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>;

#     IF EXISTS (SELECT 1 FROM CartMedicine WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>) 
#     BEGIN
#         UPDATE CartMedicine
#         SET quantity = quantity + medicine_quantity
#         WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>;
#     END;
#     ELSE
#     BEGIN
#         INSERT INTO CartMedicine (cart_id, medicine_id, quantity)
#         VALUES (<cart_id>, <medicine_id>, medicine_quantity);
#     END;
# END;

# -- Step 5: Commit the transaction
# COMMIT;

        medicines = validated_data.pop('medicines', [])
        user = self.context['request'].user
        customer = Customer.objects.get(email=user)
        
        if not customer or not user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")
        
        validated_data['customer'] = customer
        cart = Cart.objects.create(**validated_data)
        self._get_or_create_medicines(medicines, cart)
        
        cart.save()
        return cart

    def update(self, instance, validated_data):
# SELECT id
# FROM User
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM User WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('User is not authenticated.');
#     RETURN;
# END;

# SELECT id
# FROM Customer
# WHERE email = '<user_email>';

# IF NOT EXISTS (SELECT 1 FROM Customer WHERE email = '<user_email>') 
# BEGIN
#     INSERT INTO ErrorResponse (error_message) 
#     VALUES ('Customer does not exist.');
#     RETURN;
# END;

# UPDATE Cart
# SET field1 = '<updated_value1>', field2 = '<updated_value2>', ...
# WHERE id = <cart_id>;

# IF '<request_method>' = 'PUT' 
# BEGIN
#     DELETE FROM CartMedicine WHERE cart_id = <cart_id>;
# END;

# FOR EACH medicine IN medicines LOOP
#     SET medicine_name = medicine.medicine;
#     SET medicine_quantity = CAST(medicine.quantity AS INT);
    
#     SELECT id
#     FROM Medicine
#     WHERE name = medicine_name;

#     IF NOT EXISTS (SELECT 1 FROM Medicine WHERE name = medicine_name) 
#     BEGIN
#         INSERT INTO ErrorResponse (error_message) 
#         VALUES ('Medicine does not exist.');
#         RETURN;
#     END;

#     SELECT id
#     FROM CartMedicine
#     WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>;

#     IF EXISTS (SELECT 1 FROM CartMedicine WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>) 
#     BEGIN
#         UPDATE CartMedicine
#         SET quantity = quantity + medicine_quantity
#         WHERE cart_id = <cart_id> AND medicine_id = <medicine_id>;
#     END;
#     ELSE
#     BEGIN
#         INSERT INTO CartMedicine (cart_id, medicine_id, quantity)
#         VALUES (<cart_id>, <medicine_id>, medicine_quantity);
#     END;
# END;

# COMMIT;

        print('validated_data', validated_data)
        medicines = validated_data.pop('medicines', None)
        user = self.context['request'].user
        customer = Customer.objects.get(email=user)
        
        if not customer or not user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")
        
        validated_data['customer'] = customer
        instance = super().update(instance, validated_data)
        
        if self.context['request'].method == 'PUT':
            instance.medicines.clear()
            
            CartMedicine.objects.filter(cart=instance).delete()
            
        if medicines:
            self._get_or_create_medicines(medicines, instance)

        instance.save()
        return instance