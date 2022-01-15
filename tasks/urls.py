from django.urls import path

from .views import *


urlpatterns = [
	path('getTasks/<str:date>', getTasks),
	path('createTask', addTask),
	path('progressTask', progressEditTask),
	path('deleteTask', deleteTask),
	# path('editNote', editNote)
]