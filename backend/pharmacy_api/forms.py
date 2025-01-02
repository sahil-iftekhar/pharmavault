"""Admin forms."""
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model


User = get_user_model()

class CustomUserCreationForm(UserCreationForm):
    """User Creation Form."""
    class Meta:
        model = User
        fields = ('email', 'name', 'phone', 'address', 'password1', 'password2')

    def clean(self):
        """Custom validation."""
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        name = cleaned_data.get('name')
        phone = cleaned_data.get('phone')
        address = cleaned_data.get('address')
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')

        if not email:
            """No email provided"""
            raise ValidationError("Email is required.")

        if not name:
            """No Name provided"""
            raise ValidationError("Name is required.")
        
        if not phone:
            """No Phone number provided"""
            raise ValidationError("Phene number is required.")
        
        if not address:
            """No Address provided"""
            raise ValidationError("Address is required.")

        if not password1:
            """No password provided"""
            raise ValidationError("Password is required.")

        if password1 != password2:
            """Passwords do not match"""
            raise ValidationError("Passwords do not match.")

        if User.objects.filter(email=email).exists():
            """Email already exists"""
            raise ValidationError("Email already exists.")

        return cleaned_data