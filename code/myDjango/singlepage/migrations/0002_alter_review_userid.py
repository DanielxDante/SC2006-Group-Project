# Generated by Django 4.1.7 on 2023-04-02 07:53

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("singlepage", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="review",
            name="userID",
            field=models.CharField(max_length=255, null=True),
        ),
    ]
