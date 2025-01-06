from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from .models import (
    Medicine,
    Customer,
    Employee,
    Supplier,
    Medicine,
    Order,
    Supply,
    Feedback,
    Payment,
    Cart
)
from .serializers import (
    UserSerializer,
    CustomerSerializer,
    EmployeeSerializer,
    SupplierSerializer,
    MedicineSerializer,
    OrderSerializer,
    SupplySerializer,
    FeedbackSerializer,
    PaymentSerializer,
    CartSerializer
)

class LoginView(TokenObtainPairView):
# SELECT * FROM user_table WHERE email = 'user@example.com';
# SELECT 1 FROM customer_table WHERE id = 1 LIMIT 1; 
# SELECT 1 FROM employee_table WHERE id = 1 LIMIT 1;
# SELECT 1 FROM supplier_table WHERE id = 1 LIMIT 1;

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        user = get_user_model().objects.get(email=request.data['email'])
        
        if Customer.objects.filter(id=user.id).exists():
            user_role = 'Customer'
        elif Employee.objects.filter(id=user.id).exists():
            user_role = 'Employee'
        elif Supplier.objects.filter(id=user.id).exists():
            user_role = 'Supplier'
        elif user.is_superuser:
            user_role = 'Superuser'
        else:
            user_role = 'Unknown'
        
        # Add the user role to the response data
        response.data['user_role'] = user_role
        response.data['user_id'] = user.id
        
        return response


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
# SELECT * FROM user_table;

        return get_user_model().objects.all()
    
    def get_permissions(self):
# SELECT * FROM user_table WHERE email = 'user@example.com' AND password = 'hashed_password';

        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def update(self, request, *args, **kwargs):
# SELECT * FROM user_table WHERE id = 1;
# UPDATE user_table SET name = 'Updated Name', phone = '9876543210', address = '456 New St', email = 'newemail@example.com' WHERE id = 1;

        """Update a user's profile."""
        current_user = self.request.user
        user = self.get_object()
        
        if 'is_active' in request.data:
            return Response(
                {'error': 'You do not have permission to update this profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if current_user.id != user.id and not current_user.is_superuser:
            return Response(
                {'error': 'You do not have permission to update this profile.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
    # SELECT * FROM user_table WHERE id = 1;
# DELETE FROM user_table WHERE id = 1;

        current_user = self.request.user
        user_to_delete = self.get_object()
        
        if current_user.id != user_to_delete.id and not current_user.is_superuser:
            return Response(
                {'error': 'You do not have permission to delete this profile.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        if user_to_delete.is_superuser:
            return Response(
                {'error': 'You cannot delete a superuser.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        return super().destroy(request, *args, **kwargs)
        
class CustomerViewSet(UserViewSet):
    """Customer ViewSet"""
    serializer_class = CustomerSerializer
    
    def get_queryset(self):
# SELECT 1 FROM employee_table WHERE email = 'user@example.com' LIMIT 1;
# SELECT * FROM user_table;
# SELECT * FROM customer_table;

        """Filter the queryset to only include customers."""
        if Employee.objects.filter(email=self.request.user).exists() or self.request.user.is_superuser:
            return get_user_model().objects.all()
        return Customer.objects.all()
    
    def create(self, request, *args, **kwargs):
#SELECT 1 FROM user_table WHERE email = 'user@example.com' LIMIT 1;
#INSERT INTO customer_table (name, email, phone, address, created_at, updated_at) VALUES ('John Doe', 'user@example.com', '1234567890', '123 Main St', NOW(), NOW());
#INSERT INTO cart_table (customer_id, created_at, updated_at) VALUES (1, NOW(), NOW());

        """Create a new customer and automatically create a cart."""
        print(request.data)
        email = request.data.get('email')
        if get_user_model().objects.filter(email=email).exists():
            return Response(
                {'error': 'User with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        response = super().create(request, *args, **kwargs)

        # Check if the customer was created successfully
        if response.status_code == status.HTTP_201_CREATED:
            customer_id = response.data['id']
            customer = Customer.objects.get(id=customer_id)
            Cart.objects.create(customer=customer)

        return response
    
class EmployeeViewSet(UserViewSet):
    """Employee ViewSet"""
    serializer_class = EmployeeSerializer
    
    def get_queryset(self):
# SELECT 1 FROM employee_table WHERE email = 'user@example.com' LIMIT 1;
# SELECT * FROM user_table;
# SELECT * FROM user_table WHERE 1 = 0;

        """Employee and superuser can see all user profiles."""
        if Employee.objects.filter(email=self.request.user).exists() or self.request.user.is_superuser:
            return get_user_model().objects.all()
        return get_user_model().objects.none()
    
    def create(self, request, *args, **kwargs):
# INSERT INTO employee_table (name, email, phone, address, created_at, updated_at, is_active, is_staff, is_superuser) VALUES ('John Doe', 'john.doe@example.com', '1234567890', '123 Main St', NOW(), NOW(), TRUE, TRUE, FALSE);

        """Only superuser can create Employee """
        if not self.request.user.is_superuser:
            return Response(
                {'error': 'You do not have permission to create an employee.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        return super().create(request, *args, **kwargs)
    
class SupplierViewSet(UserViewSet):
    """Supplier ViewSet"""
    serializer_class = SupplierSerializer
    
    def get_queryset(self):
# SELECT 1 FROM employee_table WHERE email = 'user@example.com' LIMIT 1;
# SELECT * FROM user_table;
# SELECT * FROM supplier_table;

        """Supplier and superuser can see all user profiles."""
        if Employee.objects.filter(email=self.request.user).exists() or self.request.user.is_superuser:
            return get_user_model().objects.all()
        return Supplier.objects.all()
    
    def create(self, request, *args, **kwargs):
# INSERT INTO employee_table (name, email, phone, address, created_at, updated_at, is_active, is_staff, is_superuser) VALUES ('John Doe', 'john.doe@example.com', '1234567890', '123 Main St', NOW(), NOW(), TRUE, TRUE, FALSE);

        """Only superuser can create Employee"""
        if not self.request.user.is_superuser:
            return Response(
                {'error': 'You do not have permission to create an employee.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        return super().create(request, *args, **kwargs)
    
class MedicineViewSet(ModelViewSet):
    """Medicine ViewSet"""
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
# SELECT 1 FROM customer_table WHERE email = 'user@example.com' LIMIT 1;
# INSERT INTO medicine_table (name, description, price, created_at, updated_at) VALUES ('Aspirin', 'Pain reliever', 10.99, NOW(), NOW());
# INSERT INTO supply_table (supplier_id, medicine_id) VALUES (1, 123);


        current_user = self.request.user

        if Customer.objects.filter(email=current_user).exists():
            return Response(
                {'error': 'You do not have permission to create a medicine.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        response = super().create(request, *args, **kwargs)

        # If the user is a supplier, create a supply record
        if Supplier.objects.filter(email=current_user).exists() or current_user.is_superuser:
            supply_data = {
                'supplier': current_user.id,  
                'medicine': response.data['id'],
            }
            supply_serializer = SupplySerializer(data=supply_data)
            if supply_serializer.is_valid():
                supply_serializer.save()
            else:
                return Response(
                    {'error': 'Failed to create supply record.', 'details': supply_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return response
    
    def update(self, request, *args, **kwargs):
# SELECT 1 FROM customer_table WHERE email = 'user@example.com' LIMIT 1;
# UPDATE medicine_table SET name = 'Updated Medicine', price = 15.99, updated_at = NOW() WHERE id = 123;

        current_user = self.request.user
        
        if Customer.objects.filter(email=current_user).exists():
            return Response(
                {'error': 'You do not have permission to update this medicine.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # SELECT 1 FROM customer_table WHERE email = 'user@example.com' LIMIT 1;
# DELETE FROM medicine_table WHERE id = 123;

        current_user = self.request.user
        
        if Customer.objects.filter(email=current_user).exists():
            return Response(
                {'error': 'You do not have permission to update this medicine.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        return super().destroy(request, *args, **kwargs)
    
class SupplyViewSet(ModelViewSet):
    """Supply ViewSet"""
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def destroy(self, request, *args, **kwargs):
# SELECT COUNT(*) FROM Customer WHERE email = '<current_user_email>';
# DELETE FROM Supply WHERE id = <supply_id>;

        current_user = self.request.user
        
        if Customer.objects.filter(email=current_user).exists():
            return Response(
                {'error': 'You do not have permission to delete this supply object. Only suppliers can delete a supply object.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        return super().destroy(request, *args, **kwargs)
    
class OrderViewSet(ModelViewSet):
    """Order ViewSet"""
    serializer_class = OrderSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):

# IF EXISTS (
#     SELECT 1
#     FROM Customer
#     WHERE email = '<current_user_email>'
# )
# BEGIN

#     SELECT *
#     FROM Order
#     WHERE customer = '<current_user_email>';
# END
# ELSE
# BEGIN

#     SELECT *
#     FROM Order
#     WHERE active = TRUE;
# END;

        current_user = self.request.user
        if Customer.objects.filter(email=current_user).exists():
            return Order.objects.filter(customer=current_user)
        else:
            return Order.objects.filter(active=True)
    
    def create(self, request, *args, **kwargs):

# IF EXISTS (
#     SELECT 1
#     FROM Customer
#     WHERE email = '<current_user_email>'
# )
# OR EXISTS (
#     SELECT 1
#     FROM User
#     WHERE email = '<current_user_email>' AND is_superuser = TRUE
# )
# BEGIN

#     INSERT INTO Order (customer_id, order_details)
#     VALUES (<current_user_id>, '<order_data>');
# END
# ELSE
# BEGIN

#     INSERT INTO ErrorResponse (error_message, status_code)
#     VALUES ('You do not have permission to create an order.', 403);
# END;

        current_user = self.request.user
        
        if not (Customer.objects.filter(email=current_user).exists() 
                or current_user.is_superuser):
            return Response(
                {'error': 'You do not have permission to create an order.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        print("request", request.data)
        print("customer", current_user.id)
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):

# IF EXISTS (
#     SELECT 1
#     FROM Employee
#     WHERE email = '<current_user_email>'
# )
# OR EXISTS (
#     SELECT 1
#     FROM User
#     WHERE email = '<current_user_email>' AND is_superuser = TRUE
# )
# BEGIN
#     UPDATE Order
#     SET order_details = '<new_order_details>'
#     WHERE id = <order_id>;
# END
# ELSE
# BEGIN
#     INSERT INTO ErrorResponse (error_message, status_code)
#     VALUES ('You do not have permission to update this order.', 403);
# END;

        current_user = self.request.user
        
        if not (Employee.objects.filter(email=current_user).exists() 
                or current_user.is_superuser):
            return Response(
                {'error': 'You do not have permission to update this order.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):

# IF EXISTS (
#     SELECT 1
#     FROM Customer
#     WHERE email = '<current_user_email>'
# )
# OR EXISTS (
#     SELECT 1
#     FROM User
#     WHERE email = '<current_user_email>' AND is_superuser = TRUE
# )
# BEGIN

#     DELETE FROM Order
#     WHERE id = <order_id>;
# END
# ELSE
# BEGIN

#     INSERT INTO ErrorResponse (error_message, status_code)
#     VALUES ('You do not have permission to delete this order.', 403);
# END;

        current_user = self.request.user
        
        if not (Customer.objects.filter(email=current_user).exists() 
                or current_user.is_superuser):
            return Response(
                {'error': 'You do not have permission to delete this order.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        return super().destroy(request, *args, **kwargs)
    
class FeedbackViewSet(ModelViewSet):
    """Feedback ViewSet"""
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):

# SELECT '<request_data>' AS request_data;

# INSERT INTO Order (customer_id, order_details, total_price) VALUES (1, 'Product A, Product B', 100.00);

        print(request.data)
        
        return super().create(request, *args, **kwargs)
    
class PaymentViewSet(ModelViewSet):
    """Payment ViewSet"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
class CartViewSet(ModelViewSet):
    """Cart ViewSet"""
    serializer_class = CartSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):

# IF EXISTS (
#     SELECT 1
#     FROM Customer
#     WHERE id = <current_user_id>
# )
# BEGIN

#     SELECT *
#     FROM Cart
#     WHERE customer_id = <current_user_id>;
# END
# ELSE
# BEGIN
#     INSERT INTO ErrorResponse (error_message, status_code)
#     VALUES ('You are not a customer.', 403);
# END;

        user = self.request.user
        
        if Customer.objects.filter(id= user.id).exists():
            customer = Customer.objects.get(id=user.id)
        else:
            return Response(
                {'error': 'You are not a customer.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        return Cart.objects.filter(customer=customer)
        
        