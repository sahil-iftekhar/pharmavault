from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView
)
from . import views


router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'customers', views.CustomerViewSet, basename='customer')
router.register(r'employees', views.EmployeeViewSet, basename='employee')
router.register(r'suppliers', views.SupplierViewSet, basename='supplier')
router.register(r'medicines', views.MedicineViewSet)
router.register(r'supplies', views.SupplyViewSet)
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'feedbacks', views.FeedbackViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'carts', views.CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]