# Generated by Django 3.1.2 on 2020-10-17 08:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import notes.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150, verbose_name='Название категории')),
            ],
            options={
                'verbose_name': 'Категорию',
                'verbose_name_plural': 'Категории',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Icon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('icon', models.ImageField(blank=True, upload_to='category/icon', verbose_name='Иконка')),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='Контент')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name='Дата создания')),
                ('photo', models.ImageField(blank=True, upload_to=notes.models.user_directory_path, verbose_name='Фото')),
                ('json', models.JSONField(blank=True, default=dict, editable=False, verbose_name='json')),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='notes.category', verbose_name='Категория')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Заметку',
                'verbose_name_plural': 'Заметки',
                'ordering': ['user'],
            },
        ),
        migrations.AddField(
            model_name='category',
            name='icon',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='notes.icon', verbose_name='Иконка'),
        ),
    ]