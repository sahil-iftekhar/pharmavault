from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ValidationError
from django.core.validators import validate_email, MinValueValidator, MaxValueValidator
from django.utils.timezone import now
import re


class UserManager(BaseUserManager):
    """Custom User Manager"""
    
    def create_user(self, email, password, name, phone, address, **extra_fields):
# INSERT INTO user_table (email, name, phone, address, password, extra_field1, extra_field2, ...) VALUES ('customer1@example.com', 'customer1', '+880168789898', 'Wari', 'hashed_password', 'extra_value1', 'extra_value2', ...);

        if not email:
            raise ValueError("The Email field must be set")
        if not password:
            raise ValueError("The Password field must be set")
        
        try:
            validate_email(email)
        except:
            raise ValidationError('User must have a valid email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, phone=phone, address=address, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, name, phone, address, **extra_fields):
        """Create and save a new superuser with the given details."""
# INSERT INTO user_table (email, name, phone, address, password, is_active, is_staff, is_superuser, ...) VALUES ('admin@example.com', 'Name', '+8801734567890', 'Admin Address', 'hashed_password', True, True, True, ...);

        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(email, password, name, phone, address, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    """Custom User Model"""
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone = PhoneNumberField(unique=True)
    address = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    slug = models.SlugField(unique=True, blank=True, null=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "phone", "address"]
    
    def _pass_valid(self, password):
        """Private method for testing valid password"""
# INSERT INTO user_table (email, name, phone, address, password, is_active, is_staff, is_superuser) VALUES ('user@example.com', 'John Doe', '1234567890', '123 Main St', 'hashed_password', True, False, False);
# UPDATE user_table SET password = 'hashed_new_password' WHERE id = 1;

        if password:
            if (len(password) < 8 or
                not re.search(r"[a-z]", password) or
                not re.search(r"[A-Z]", password) or
                not re.search(r"[0-9]", password) or
                not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)):
                raise ValidationError('Password must contain at least 8 characters, '
                                      'including an uppercase letter, a lowercase letter, '
                                      'a number, and a special character.')

    def set_password(self, raw_password):
# INSERT INTO user_table (email, name, phone, address, password, is_active, is_staff, is_superuser) VALUES ('user@example.com', 'John Doe', '1234567890', '123 Main St', 'hashed_password_value', True, False, False);
# UPDATE user_table SET password = 'hashed_new_password_value' WHERE id = 1;

        """Validates raw password before hashing"""
        self._pass_valid(raw_password)
        super().set_password(raw_password)

    def save(self, *args, **kwargs):
# INSERT INTO user_table (email, name, phone, address, password, is_active, is_staff, is_superuser) VALUES ('user@example.com', 'John Doe', '1234567890', '123 Main St', 'hashed_password_value', True, False, False);
# UPDATE user_table SET email = 'user@example.com', name = 'John Doe', phone = '1234567890', address = '123 Main St', password = 'hashed_new_password_value', is_active = True, is_staff = False, is_superuser = False WHERE id = 1;

        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        """Return Email"""
# SELECT * FROM user_table WHERE email = 'user@example.com';
        return self.email
    
class Customer(User):
    """Customer Model"""
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.email
    
class Employee(User):
    """Employee Model"""
    
    def save(self, *args, **kwargs):
        self.is_staff = True
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.email
    
class Supplier(User):
    """Supplier Model"""
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.is_staff = True
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email

class Medicine(models.Model):
    """Medicine Model"""
    name = models.CharField(unique=True, max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    expiry_date = models.DateField()
    slug = models.SlugField(unique=True, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
class Order(models.Model):
    """Order Model"""
    DELIVERY_TYPE = [
        ('once', 'Once'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    Status = [
        ('accepted', 'Accepted'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
        ('delivered', 'Delivered')
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    status = models.CharField(
        max_length=10,
        choices=Status,
        default='pending',
    )
    placed_date = models.DateField(auto_now_add=True)
    delivery_date = models.DateField()
    delivery_type = models.CharField(
        max_length=10,
        choices=DELIVERY_TYPE,
        default='once',
    )
    medicines = models.ManyToManyField('OrderedMedicine', related_name='ordered_medicines')
    prescription_images = models.ManyToManyField('OrderedPrescriptionImage', blank=True, related_name='ordered_prescription_images')
    slug = models.SlugField(unique=True, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        if self.delivery_date < now().date():
            raise ValidationError('Delivery date cannot be earlier than the placed date.')
        
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Order #{self.id}"
    
class OrderedMedicine(models.Model):
    """Ordered Medicine Model"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Ordered Medicine #{self.id}"
    
class OrderedPrescriptionImage(models.Model):
    """Prescription Model"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='prescriptions_images/')
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Prescription #{self.id}"

class Supply(models.Model):
    """Supply Model"""
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    supplied_date = models.DateField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Supply #{self.id}"
    
class Feedback(models.Model):
    """Feedback Model"""
    name = models.CharField(max_length=255, default='Anonymous')
    feedback_text = models.TextField()
    rating = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Feedback #{self.id}"
    
class Payment(models.Model):
    """Payment Model"""
    PAYMENT_METHOD = [
        ('ondelivery', 'On Delivery'),
        ('card', 'Card'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    payment_method = models.CharField(
        max_length=255,
        choices=PAYMENT_METHOD,
        default='ondelivery',
    )
    processed_date = models.DateField(auto_now_add=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Cart #{self.id}"
    
class Cart(models.Model):
    """Cart Model"""
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    medicines = models.ManyToManyField('CartMedicine', related_name='cart_medicines', blank=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Cart #{self.id}"
    
class CartMedicine(models.Model):
    """Cart Medicine Model"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Cart Medicine #{self.id}"