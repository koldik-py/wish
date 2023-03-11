from django.contrib import admin

from .models import Note, Category, Icon


class NoteAdmin(admin.ModelAdmin):
	list_display = ('id', 'content', 'created_at', 'user')
	list_display_links = ('content','created_at')

class CategoryAdmin(admin.ModelAdmin):
	list_display = ('id', 'title')
	list_display_links = ('id', 'title')

class IconAdmin(admin.ModelAdmin):
	list_display = ('id', 'icon')
	list_display_links = ('id', 'icon')

admin.site.register(Note, NoteAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Icon, IconAdmin)

