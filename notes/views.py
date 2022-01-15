from django.http import JsonResponse
from .logics import dateSortNotes, createNote, removeNote, editableNote
from notes.models import Category, Icon

def getNotes(request, date):
	''' Заметки на месяц '''
	
	data = dateSortNotes(date, request.user.id)

	return JsonResponse(data)

def addNote(request):
	x = createNote(request)
	if x:
		data = {0:1 , 'pk': x[1]}
	else:
		data = {0:0}

	return JsonResponse(data)

def deleteNote(request):
	if removeNote(request):
		data = {0:1}
	else:
		data = {0:0}

	return JsonResponse(data)

def editNote(request):
	if editableNote(request):
		data = {0:1}
	else:
		data = {0:0}

	return JsonResponse(data)

def getCategory(request):
	cat = Icon.objects.all()
	data = {}
	for i in cat:
		data[i.pk] = i.icon.url

	return JsonResponse(data)

def createCategory(request):
	
	icon = Icon.objects.get(pk=request.POST['pk'])
	x = Category.objects.create(title=request.POST['title'], icon=icon)
	x.save()

	return JsonResponse({0:1})
