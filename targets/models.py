from django.db import models
from django.contrib.auth.models import User


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'user_{instance.user.id}/{filename}'

class Target(models.Model):
	''' Цели  '''
	user = models.ForeignKey(User, on_delete=models.CASCADE, null = True, verbose_name='Пользователь')
	title = models.TextField('Контент')
	deadline = models.DateField('Дедлайн')
	color = models.CharField('Цвет', max_length=30, default='#56CCF2')
	performance = models.BooleanField('Выполнение', default= False, editable=False)
	photo = models.ImageField('Фото', upload_to=user_directory_path, blank=True)
	result = models.IntegerField('Конечный результат', default=0, editable=False)
	result_user = models.IntegerField('Текущий результат', default=0, editable=False)
	progress = models.ForeignKey('Progress', on_delete= models.PROTECT, verbose_name='Прогресс')

	class Meta:
		verbose_name = 'Цель'
		verbose_name_plural = 'Цели'
		ordering = ['user']

class Progress(models.Model):
	title = models.CharField('Название', max_length=30)

	def __str__(self):
		return self.title

	class Meta:
		verbose_name = 'Прогресс'
		verbose_name_plural = 'Прогресс'
		ordering = ['title']

		