"""Signals used before or after saving a model"""
from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import Group
from django.dispatch import receiver
from django.utils.text import slugify
from .models import User, Medicine, Order, Payment, Cart


@receiver(post_save, sender=User)
def save_user_slug(sender, instance, created, **kwargs):
    """Create slug for user using username"""
    if created or (slugify(instance.email) != instance.slug):
        instance.slug = slugify(instance.email)
        instance.save()

@receiver(post_save, sender=User)
def set_user_default_group(sender, instance, created, **kwargs):
    if created and instance.pk:
        default_group, _ = Group.objects.get_or_create(name="Default")
        instance.groups.add(default_group)

@receiver(post_save, sender=Medicine)
def set_medicine_slug(sender, instance, created, **kwargs):
    if created or (slugify(instance.name) != instance.slug):
        instance.slug = slugify(instance.name)
        instance.save()
        
@receiver(post_save, sender=Order)
def set_order_slug(sender, instance, created, **kwargs):
    if created or (slugify(instance.id) != instance.slug):
        instance.slug = slugify(instance.id)
        instance.save()
        
@receiver(post_save, sender=Payment)
def set_payment_slug(sender, instance, created, **kwargs):
    if created or (slugify(instance.id) != instance.slug):
        instance.slug = slugify(instance.id)
        instance.save()
        
@receiver(post_save, sender=Cart)
def set_cart_slug(sender, instance, created, **kwargs):
    if created or (slugify(instance.id) != instance.slug):
        instance.slug = slugify(instance.id)
        instance.save()
        
