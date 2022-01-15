from django.urls import path

from .views import *


urlpatterns = [
	path('getNotes/<str:date>', getNotes),
	path('createNote', addNote),
	path('deleteNote', deleteNote),
	path('editNote', editNote),
	path('createCategory', createCategory),
	path('getCategory', getCategory),

]