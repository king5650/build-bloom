from django.urls import path

from .views import EquipmentListView, ProjectDetailView, ProjectListView, TeamMemberListView

urlpatterns = [
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/<slug:slug>/", ProjectDetailView.as_view(), name="project-detail"),
    path("team/", TeamMemberListView.as_view(), name="team-list"),
    path("equipment/", EquipmentListView.as_view(), name="equipment-list"),
]
