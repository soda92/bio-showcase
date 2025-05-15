import django.views.generic
import django.utils.timezone

# Create your views here.


class IndexView(django.views.generic.ListView):
    template_name = 'primer/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        """Return the last five published questions."""
        return []
