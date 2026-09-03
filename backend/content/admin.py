from django.contrib import admin

from .models import Equipment, Project, ProjectImage, TeamMember


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title_en", "category", "location", "completed_date")
    list_filter = ("category",)
    search_fields = ("title_en", "title_fr", "location")
    prepopulated_fields = {"slug": ("title_en",)}
    inlines = [ProjectImageInline]


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role_en", "order")
    ordering = ("order",)


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ("name_en",)
