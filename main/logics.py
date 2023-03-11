from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
import datetime


def userAuthentication(request):
	try:
		form = AuthenticationForm(data=request.POST)

		if form.is_valid():
			user = form.get_user()
			login(request,user)

			return True
		return False
	except:
		return False
def logging(message):
	file = open('main/logging/error','a')
	print(f'{datetime.datetime.now()} : {message}', file=file)
	file.close()