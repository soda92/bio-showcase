import django.views.generic
import django.utils.timezone
from primer3 import bindings
from .models import PCRResult

# Create your views here.


class IndexView(django.views.generic.ListView):
    template_name = 'primer/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        """Return the last five published questions."""
        return []


def design(request):
    try:
        seq_start = request.POST['seq_start']
    except KeyError:
        # Redisplay the question voting form.
        return django.shortcuts.render(
            request=request,
            template_name='primer/index.html',
            context={
                'error_message': "You didn't select a choice.",
            },
        )
    else:
        result = PCRResult(seq_start=seq_start)
        return django.shortcuts.render(
            request=request,
            template_name='primer/index.html',
            context={'result': result},
        )
