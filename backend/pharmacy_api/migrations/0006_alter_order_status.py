# Generated by Django 5.1.4 on 2025-01-06 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pharmacy_api', '0005_alter_cart_customer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('accepted', 'Accepted'), ('pending', 'Pending'), ('rejected', 'Rejected'), ('delivered', 'Delivered')], default='pending', max_length=10),
        ),
    ]
