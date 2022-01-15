from django.contrib.auth.models import User
import datetime
import json

from .models import Note, Category


def dateSortNotes(date, user_id):
	'''  GET date '2020-8-31,2020-10-4' (start date, last date) [year-mounth-day]  '''
	try:
		date = date.split(',')
		notes = Note.objects.filter(created_at__range=[date[0], date[1]], user= user_id )
		data = {}
		for e,i in enumerate(notes):
			# ключ - дата, значение - ВСЕ заметки на эту дату
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
		data = {'error':'Не удалось сформировать заметки'}
	

	return data

def createNote(request):
	''' Сохранение заметки {'content':'..','created_at': 'year-month-day'} '''
	try:
		data = json.loads(request.body)
		category = Category.objects.get(title=data['category'])
		user = User.objects.get(pk = request.user.id)
		newNote = Note.objects.create(user=user, content=data['content'], category=category)
		
		if newNote.created_at.__str__() != data['created_at']:
			date = data['created_at'].split('-')
			date = datetime.date(int(date[0]), int(date[1]), int(date[2]))
			newNote.created_at = date
		 
		newNote.save()
		# 
		if noteJson(newNote):
			return [True, newNote.pk]
		else:
			return 0
	except:

		return 0

def removeNote(request):
	try:
		data = json.loads(request.body)
		note = Note.objects.get(pk=data['pk'],user=request.user.id)
		note.delete()

		return True
	except:
		return False

def editableNote(request):
	try:
		data = json.loads(request.body)
		note = Note.objects.get(pk=data['pk'],user=request.user.id)
		category = Category.objects.get(title=data['title'])
		note.content = data['content']
		note.category = category
		note.save()
		# 
		if noteJson(note):
			return True
		else:
			return False
	except:
		return False

def noteJson(elem):
	try:
		elem.json = {
		'pk': elem.pk.__str__(),
		'content': elem.content.__str__(),
		'category.title': elem.category.title.__str__(),
		'category.icon.url': elem.category.icon.icon.url.__str__()
		}
		elem.save()
		return 1
	except:
		return 0
		