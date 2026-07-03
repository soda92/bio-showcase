from django.urls import path

from . import views

app_name = 'primer'

urlpatterns = [
    # ex: /primer/
    path('', views.IndexView.as_view(), name='index'),
    path('design/', views.design, name='design'),
    path('api/design/', views.api_design, name='api_design'),
    path('api/sandbox/run/', views.api_sandbox_run, name='api_sandbox_run'),
    path('api/sandbox/test/', views.api_sandbox_test, name='api_sandbox_test'),
]
