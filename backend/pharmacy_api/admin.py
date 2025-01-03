from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User,
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
from .forms import CustomUserCreationForm

class UserAdmin(BaseUserAdmin):
    """Custom User Admin"""
    list_display = ('email',)
    ordering = ['email']
    list_filter = ('groups',)
    prepopulated_fields = {"slug": ("email",)}

    #Fields to be displayed on the user detail page
    fieldsets = (
        (None, {
            'fields': ('email', 'password', 'slug')
        }),
        ('Personal_info', {
            'fields': ('name','phone', 'address')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login',)
        }),
    )

    add_form = CustomUserCreationForm
    # Fields to be displayed in user creation form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'phone', 'address', 'slug', 
                       'password1', 'password2', 'is_active', 'is_staff')
        }),
    )
    
class CustomerAdmin(UserAdmin):
    list_display = ('email',)
    
class EmployeeAdmin(UserAdmin):
    list_display = ('email',)
    
class SupplierAdmin(UserAdmin):
    list_display = ('email',)

admin.site.register(User, UserAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Supplier, SupplierAdmin)
admin.site.register(Medicine)
admin.site.register(Order)
admin.site.register(Payment)
admin.site.register(Cart)
admin.site.register(OrderedMedicine)
admin.site.register(OrderedPrescriptionImage)
admin.site.register(Supply)
admin.site.register(Feedback)
