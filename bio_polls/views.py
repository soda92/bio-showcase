from django.http import HttpResponse
from .models import Question
import django.shortcuts
import django.http


def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}

    return django.shortcuts.render(
        request=request, template_name='polls/index.html', context=context
    )


def detail(request, question_id):
    question = django.shortcuts.get_object_or_404(Question, pk=question_id)
    return django.shortcuts.render(
        request=request,
        template_name='polls/detail.html',
        context={'question': question},
    )


def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)


def vote(request, question_id):
    return HttpResponse("You're voting on question %s." % question_id)
