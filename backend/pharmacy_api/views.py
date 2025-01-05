from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
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
        
        return response


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        return get_user_model().objects.all()
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def update(self, request, *args, **kwargs):
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
        """Filter the queryset to only include customers."""
        if Employee.objects.filter(email=self.request.user).exists() or self.request.user.is_superuser:
            return get_user_model().objects.all()
        return Customer.objects.all()
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        email = request.data.get('email')
        if get_user_model().objects.filter(email=email).exists():
            return Response(
                {'error': 'User with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        return super().create(request, *args, **kwargs)
    
class EmployeeViewSet(UserViewSet):
    """Employee ViewSet"""
    serializer_class = EmployeeSerializer
    
    def get_queryset(self):
        """Employee and superuser can see all user profiles."""
        if Employee.objects.filter(email=self.request.user).exists() or self.request.user.is_superuser:
            return get_user_model().objects.all()
        return get_user_model().objects.none()
    
    def create(self, request, *args, **kwargs):
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
        """Supplier and superuser can see all user profiles."""
        if Employee.objects.filter(email=self.request.user).exists() or self.request.user.is_superuser:
            return get_user_model().objects.all()
        return Supplier.objects.all()
    
    def create(self, request, *args, **kwargs):
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
        current_user = self.request.user
        
        if Customer.objects.filter(email=current_user).exists():
            return Response(
                {'error': 'You do not have permission to update this medicine.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
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
        current_user = self.request.user
        
        if Customer.objects.filter(email=current_user).exists():
            return Response(
                {'error': 'You do not have permission to delete this supply object. Only suppliers can delete a supply object.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        return super().destroy(request, *args, **kwargs)
    
class OrderViewSet(ModelViewSet):
    """Order ViewSet"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        current_user = self.request.user
        
        if not (Customer.objects.filter(email=current_user).exists() 
                or current_user.is_superuser):
            return Response(
                {'error': 'You do not have permission to create an order.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        current_user = self.request.user
        
        if not (Employee.objects.filter(email=current_user).exists() 
                or current_user.is_superuser):
            return Response(
                {'error': 'You do not have permission to update this order.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        current_user = self.request.user
        
        if not (Employee.objects.filter(email=current_user).exists() 
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
    
class PaymentViewSet(ModelViewSet):
    """Payment ViewSet"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
class CartViewSet(ModelViewSet):
    """Cart ViewSet"""
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
        
        