from django.db import models
from django.contrib.auth.models import User
import uuid

class Profile(models.Model):
	''' Профиль '''
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	color = models.CharField('Цвет', max_length=30, default='#56CCF2')
	user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='Пользователь')
	name = models.CharField('Имя', max_length=30)



	class Meta:
		verbose_name = 'Профиль'
		verbose_name_plural = 'Профили'
		ordering = ['user']


