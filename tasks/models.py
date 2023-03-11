from django.db import models
from django.contrib.auth.models import User

from notes.models import Category


class Task(models.Model):
	''' Задачи  '''
	user = models.ForeignKey(User, on_delete=models.CASCADE, null = True, verbose_name='Пользователь')
	content = models.TextField('Контент')
	created_at = models.DateField('Дата создания', auto_now_add=True)
	progress = models.BooleanField('Выполнение', default= False)
	category = models.ForeignKey(Category, on_delete= models.PROTECT, null=True, blank=True, verbose_name='Категория')
	json = models.JSONField('json', default=dict, blank=True, editable=False)

	class Meta:
		verbose_name = 'Задачу'
		verbose_name_plural = 'Задачи'
		ordering = ['user']
