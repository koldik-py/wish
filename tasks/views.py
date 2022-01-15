from django.http import JsonResponse

from .logics import dateSortTasks, createTask, progressEdit, deleteTaskL


def getTasks(request, date):
	''' Задачи на месяц '''
	
	data = dateSortTasks(date, request.user.id)

	return JsonResponse(data)

def addTask(request):
	x = createTask(request)
	if x:
		data = {0:1 , 'pk': x[1]}
	else:
		data = {0:0}

	return JsonResponse(data)

def progressEditTask(request):
	if progressEdit(request):
		data = {0:1}
	else:
		data = {0:0}

	return JsonResponse(data)
	
def deleteTask(request):
	data = deleteTaskL(request)

	return JsonResponse(data)
