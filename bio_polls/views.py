from django.http import HttpResponse


def index(request):
    return HttpResponse("<a href='https://docs.djangoproject.com/en/5.2/intro/tutorial02/'>https://docs.djangoproject.com/en/5.2/intro/tutorial02/</a><br>Hello, world. You're at the polls index.")