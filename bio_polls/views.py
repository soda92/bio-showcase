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
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise django.http.Http404('Question does not exist')
    else:
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
