from django.db import models
from django.contrib.auth.models import User

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'user_{instance.user.id}/{filename}'

class Note(models.Model):
	''' Заметки  '''
	user = models.ForeignKey(User, on_delete=models.CASCADE, null = True, verbose_name='Пользователь')
	content = models.TextField('Контент')
	created_at = models.DateField('Дата создания', auto_now_add=True)
	photo = models.ImageField('Фото', upload_to=user_directory_path, blank=True)
	category = models.ForeignKey(
		'Category', 
		on_delete= models.PROTECT, 
		null=True, blank=True, verbose_name='Категория')
	json = models.JSONField('json', default=dict, blank=True, editable=False)

	class Meta:
		verbose_name = 'Заметку'
		verbose_name_plural = 'Заметки'
		ordering = ['user']

class Category(models.Model):
	''' Категория  '''
	title = models.CharField(max_length=150, verbose_name = 'Название категории')
	icon = models.ForeignKey('Icon',on_delete= models.PROTECT ,verbose_name='Иконка')

	def __str__(self):
		return self.title
	
	class Meta:
		verbose_name = 'Категорию'
		verbose_name_plural = 'Категории'
		ordering = ['id']

class Icon(models.Model):
	''' Категория  '''
	icon = models.ImageField(upload_to='category/icon', blank=True,verbose_name='Иконка')

	def __str__(self):
		return self.icon.path