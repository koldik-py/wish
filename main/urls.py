from django.urls import path

from .views import *


urlpatterns = [
    path('', production),
    path('notes', index),
    path('exit', exit),
    path('test', test)
]