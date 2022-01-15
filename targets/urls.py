from django.urls import path

from .views import *


urlpatterns = [
	path('getTargets', getTargets),
	path('getProgress', getProgress),
	path('createTarget', createTarget),
	path('deletTarget', deleteTarget),
	path('editTarget', editTarget),
	path('editProgress', editProgress),
	path('addProgress', addProgress),
	
]