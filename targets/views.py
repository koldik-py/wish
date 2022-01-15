from django.http import JsonResponse


from .logics import *
from .models import Progress


def addProgress(request):
	x = Progress.objects.create(title=request.POST['title'])
	x.save()
	return JsonResponse({0:1})

def getTargets(request):
	data = generateTarget(request)

	return JsonResponse(data)
	
def getProgress(request):
	data = generateProgress(request)

	return JsonResponse(data)

def createTarget(request):
	data = addTarget(request)

	return JsonResponse(data)

def deleteTarget(request):
	data = delTarget(request)

	return JsonResponse(data)

def editTarget(request):
	data = editTargetL(request)

	return JsonResponse(data)

def editProgress(request):
	data = editProgressL(request)

	return JsonResponse(data)