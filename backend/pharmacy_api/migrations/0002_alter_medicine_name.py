# Generated by Django 5.1.3 on 2025-01-02 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pharmacy_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medicine',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]