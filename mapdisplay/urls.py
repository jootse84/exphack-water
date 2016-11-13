# mapdisplay/urls.py
from django.conf.urls import url
from mapdisplay import views

urlpatterns = [
    url(r'^$', views.HomePageView.as_view()),
]