from django.contrib.auth.models import User
import json
import datetime
import os

from PIL import Image

from .models import Target, Progress
from main.logics import logging
# 328x187  660x386

def generateTarget(request):
	try:
		targets = Target.objects.filter(user=request.user.id)
		if targets:
			data = {}
			for e,i in enumerate(targets):
				data[e] = {}
				data[e]['pk'] = i.pk.__str__()
				data[e]['title'] = i.title.__str__()
				data[e]['photo_url'] = i.photo.url.__str__()
				data[e]['color'] = i.color.__str__()
				data[e]['deadline'] = i.deadline.__str__()
				data[e]['result'] = i.result.__str__()
				data[e]['result_user'] = i.result_user.__str__()
				data[e]['progress_title'] = i.progress.title.__str__()

			return data
		return {0:0, 1: 'Cуществующие <Цели> не найдены'}
	except:
		return {0:0, 1: 'Произошла ошибка при генерации существующих <Целей>'}

def generateProgress(request):
	try:
		progress = Progress.objects.all()
		data = {}
		for n,i in enumerate(progress):
			data[n] = i.title

		return data
	except:
		return {0:0, 1: 'Произошла ошибка при генерации существующих <Прогресс>'}

def delTarget(request):
	try:
		data = json.loads(request.body)
		target = Target.objects.get(user=request.user.id, pk=data['pk'])
		deleteImageDir(target.photo.path)
		target.delete()

		return {0:1}
	except:
		return {0:0, 1:'Произошла ошибка при удалении <Цели>'}

def addTarget(request):
	try:
		img = request.FILES['img']
		i = request.POST

		user = User.objects.get(pk = request.user.id)
		date = i['deadline'].split('-')
		date = datetime.date(int(date[0]), int(date[1]), int(date[2]))
		
		progress = Progress.objects.get(title=i['progress_title']) 
		target = Target.objects.create(
			user=user, 
			title=i['title'],
			deadline=date,
			color=i['color'], photo=img,
			result=i['result'],
			progress=progress)

		target.save()
		crop_img(target.photo.path)
		target.save()
		if target:
			return {0: 1, 'pk': target.pk, 'photo_url': target.photo.url}

		return {0:0, 1: 'Не удалось обработать данные и сформировать <Цель>'}
	except:
		return {0:0, 1: 'Произошла ошибка'}

def editTargetL(request):
	try:
		i = request.POST
			
		user = User.objects.get(pk = request.user.id)
		date = i['deadline'].split('-')
		date = datetime.date(int(date[0]), int(date[1]), int(date[2]))
		
		progress = Progress.objects.get(title=i['progress_title']) 
		target = Target.objects.get(pk=int(i['pk']), user=request.user.id)

		target.title = i['title']
		target.deadline = date
		target.color = i['color']
		target.result = int(i['result'])
		target.progress = progress

		target.save()

		if i['imgEdit'] == 'true':
			deleteImageDir(target.photo.path)
			target.photo = request.FILES['img']
			target.save()
			crop_img(target.photo.path)
			target.save()

		if target:
			return {0: 1, 'photo_url': target.photo.url}

		return {0:0, 1: 'Не удалось обработать данные и изменить <Цель>'}
	except Exception as ex:
		logging(f'Произошла ошибка при изменении цели. Пользователь: {request.user}. Ошибка: {ex}')
		return {0:0, 1: 'Произошла ошибка при изменении цели'}

def editProgressL(request):
	try:
		data = json.loads(request.body)
		target = Target.objects.get(user=request.user.id, pk=data['pk'])
		target.result_user = data['result_user']
		target.save()

		return {0: 1}
	except Exception as ex:
		logging(f'Произошла ошибка при прогресса цели. Пользователь: {request.user}. Ошибка: {ex}')
		return {0:0, 1: 'Произошла ошибка при изменении прогресса цели'}

def deleteImageDir(url):
	os.remove(url)
def crop_img(imgPath):
	# Соотношение сторон (нужное)
	def aspect_ratio(width, heigth):
		baseWidth = width
		baseHeigth = heigth

		# Наибольший общий делитель
		while width != 0 and heigth != 0:
			if width > heigth: width %= heigth
			else: heigth %= width

		result = width + heigth
		# Соотношение сторон
		return (int(baseWidth/result), int(baseHeigth/result))
		
	# Рассчёт области вырезания
	def calculation_ratio(width, heigth, countW, countH):
		# Минимальный общий делитель

		generalCount = min([int(width/countW),int(heigth/countH)])

		# Область которую нужно вырезать
		cropWidth = width - (countW * generalCount)
		cropHeigth = heigth - (countH * generalCount)
		# 
		if cropWidth % 2 != 0:
			cropWidth = (cropWidth - 1)/2
			x = cropWidth
			x1 = cropWidth + 1
		else:
			x = cropWidth / 2
			x1 = cropWidth / 2
		if cropHeigth % 2 != 0:
			cropHeigth = (cropHeigth - 1) / 2
			y = cropHeigth
			y1 = cropHeigth + 1
		else:
			y = cropHeigth / 2
			y1 = cropHeigth / 2

		return (int(x), int(y), int(width - x1), int(heigth - y1))

	x,y = aspect_ratio(328, 186)
	img = Image.open(imgPath)

	sizeX, sizeY = img.size
	size = calculation_ratio(sizeX, sizeY, x, y)

	img.crop(size).save(imgPath)

