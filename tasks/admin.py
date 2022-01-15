from django.contrib import admin

from .models import Task


class TaskAdmin(admin.ModelAdmin):
	list_display = ('id', 'content', 'created_at', 'progress', 'user')
	list_display_links = ('content', 'created_at')


admin.site.register(Task, TaskAdmin)
