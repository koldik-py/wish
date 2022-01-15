from django.contrib import admin
from .models import Target, Progress

# Register your models here.
class TargetAdmin(admin.ModelAdmin):
	list_display = ('id', 'title','deadline','progress', 'user')
	list_display_links = ('id', 'title', 'user')

class ProgressAdmin(admin.ModelAdmin):
	list_display = ('id', 'title')
	list_display_links = ('id', 'title')

admin.site.register(Target, TargetAdmin)
admin.site.register(Progress, ProgressAdmin)