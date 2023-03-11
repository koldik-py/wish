# Generated by Django 3.1.2 on 2020-10-17 08:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('notes', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='Контент')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name='Дата создания')),
                ('progress', models.BooleanField(default=False, verbose_name='Выполнение')),
                ('json', models.JSONField(blank=True, default=dict, editable=False, verbose_name='json')),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='notes.category', verbose_name='Категория')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Задачу',
                'verbose_name_plural': 'Задачи',
                'ordering': ['user'],
            },
        ),
    ]
