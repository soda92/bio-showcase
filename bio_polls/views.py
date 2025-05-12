from django.http import HttpResponse
from .models import Question


def index(request):
    output = "<a href='https://docs.djangoproject.com/en/5.2/intro/tutorial02/'>https://docs.djangoproject.com/en/5.2/intro/tutorial02/</a><br>Hello, world. You're at the polls index."

    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    output += ', '.join([q.question_text for q in latest_question_list])
    return HttpResponse(output)


def detail(request, question_id):
    return HttpResponse("You're looking at question %s." % question_id)


def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)


def vote(request, question_id):
    return HttpResponse("You're voting on question %s." % question_id)
