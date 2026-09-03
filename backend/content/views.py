from rest_framework import generics

from .models import Equipment, Project, TeamMember
from .serializers import (
    EquipmentSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    TeamMemberSerializer,
)


class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.prefetch_related("images")
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.prefetch_related("images")
    serializer_class = ProjectDetailSerializer
    lookup_field = "slug"


class TeamMemberListView(generics.ListAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer


class EquipmentListView(generics.ListAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
