from django.http import HttpResponse, HttpResponseRedirect
import django.urls
from .models import Question, Choice
import django.shortcuts
import django.http
import django.db.models


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
    question = django.shortcuts.get_object_or_404(Question, pk=question_id)
    return django.shortcuts.render(
        request=request,
        template_name='polls/results.html',
        context={'question': question},
    )


def vote(request, question_id):
    question: Question = django.shortcuts.get_object_or_404(Question, pk=question_id)
    try:
        selected_choice: Choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return django.shortcuts.render(
            request=request,
            template_name='polls/detail.html',
            context={
                'question': question,
                'error_message': "You didn't select a choice.",
            },
        )
    else:
        selected_choice.votes = django.db.models.F('votes') + 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after sucessfully dealing with POST data.
        # This prevents data from being posted twice if a use hits the Back button.
        return HttpResponseRedirect(
            django.urls.reverse('polls:results', args=(question_id,))
        )
