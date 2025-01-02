from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
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
    OrderedMedicine,
    PrescriptionImage,
    Payment,
    Cart
)
from .serializers import (
    UserSerializer,
)


class UserViewSet(ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    
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
                {'detail': 'You do not have permission to update this profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if current_user.id != user.id and not current_user.is_superuser:
            return Response(
                {'detail': 'You do not have permission to update this profile.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        current_user = self.request.user
        user_to_delete = self.get_object()
        
        if current_user.id != user_to_delete.id:
            return Response(
                {'detail': 'You do not have permission to delete this profile.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        if user_to_delete.is_superuser:
            return Response(
                {'detail': 'You cannot delete a superuser.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        return super().destroy(request, *args, **kwargs)
        