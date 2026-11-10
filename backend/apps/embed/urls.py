from django.urls import path

from .views import EmbedSessionView

urlpatterns = [
    path("embed/sessions/", EmbedSessionView.as_view(), name="embed-session"),
]
