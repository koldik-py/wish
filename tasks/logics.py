from django.contrib.auth.models import User
import datetime
import json

from notes.models import Category
from .models import Task

def dateSortTasks(date, user_id):
	'''  GET date '2020-8-31,2020-10-4' (start date, last date) [year-mounth-day]  '''
	try:
		date = date.split(',')
		tasks = Task.objects.filter(created_at__range=[date[0], date[1]], user= user_id )
		data = {}

		for e,i in enumerate(tasks):
			print(i.json)
			if e == 0:
				data[i.created_at.__str__()] = []
				data[i.created_at.__str__()].append(i.json)
				continue
			if i.created_at.__str__() in data:
				data[i.created_at.__str__()].append(i.json)
			else:
				data[i.created_at.__str__()] = []
				data[i.created_at.__str__()].append(i.json)
		
	except:
		data = {'error':'Не удалось сформировать задачи'}
		
	return data
		
def createTask(request):
	''' Сохранение заметки {'content':'..','created_at': 'year-month-day'} '''
	try:
		data = json.loads(request.body)
		category = Category.objects.get(title=data['category'])
		user = User.objects.get(pk = request.user.id)
		newTask = Task.objects.create(user=user, content=data['content'], category=category)
		
		if newTask.created_at.__str__() != data['created_at']:
			date = data['created_at'].split('-')
			date = datetime.date(int(date[0]), int(date[1]), int(date[2]))
			newTask.created_at = date

		newTask.save()

		if taskJson(newTask):
			return [True, newTask.pk]
		
		else:
			return 0
	except:

		return 0


def progressEdit(request):
	try:
		data = json.loads(request.body)
		user = User.objects.get(pk = request.user.id)
		task = Task.objects.get(user=user, pk= data['pk'])
		
		if data['progress']:
			task.progress = data['progress']
			task.json['progress'] = task.progress
			task.save()
		else: 
			task.progress = data['progress']
			task.json['progress'] = task.progress
			task.save()

		return 1
	except:

		return 0

def taskJson(elem):
	try:
		
		elem.json = {
		'pk': elem.pk.__str__(),
		'content': elem.content.__str__(),
		'progress': elem.progress.__str__(),
		'category.title': elem.category.title.__str__(),
		'category.icon.url': elem.category.icon.icon.url.__str__()
		}
		
		elem.save()
		return 1
	except:
		return 0

def deleteTaskL(request):
	try:
		data = json.loads(request.body)
		task = Task.objects.get(pk=data['pk'], user=request.user.id)
		task.delete()
		
		return {0:1}
	except:
		return {0:0, 1: 'Ошибка при удалении <Плана>'}