from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import login, logout

from .logics import userAuthentication
from notes.models import Category
from targets.models import Progress


def production(request):
	HTML = 'production.html'
	context = {
	'title': 'WISH',
	}
	if request.method == 'POST':
		if userAuthentication(request):
			# return HttpResponseRedirect('http://localhost:8000/notes')
			return HttpResponseRedirect('/notes')
		else:
			return render(request,'error.html', {'error':'Произошла ошибка авторизации'})

	if request.user.is_authenticated: 
		# return HttpResponseRedirect('http://localhost:8000/notes')
		return HttpResponseRedirect('/notes')

	return render(request, HTML, context)

def index(request):
	HTML = 'index.html'
	
	context = {
	'title':'WISH | Заметки',
	'user_logo': request.user.__str__()[0],
	'category': Category.objects.all(),
	'progress': Progress.objects.all()
	}

	return render(request, HTML, context)

def exit(request):

	logout(request)

	return production(request)

def test(request):
	HTML = 'test.html'
	
	context = {
	'title':'WISH | Заметки',
	'progress': Progress.objects.all()
	}

	return render(request, HTML, context)
	