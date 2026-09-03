from django.db import models


class Project(models.Model):
    title_fr = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    description_fr = models.TextField()
    description_en = models.TextField()
    category = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-completed_date"]

    def __str__(self):
        return self.title_en


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="projects/")
    is_before_after = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title_en} - image {self.order}"


class TeamMember(models.Model):
    name = models.CharField(max_length=150)
    role_fr = models.CharField(max_length=150)
    role_en = models.CharField(max_length=150)
    bio_fr = models.TextField(blank=True)
    bio_en = models.TextField(blank=True)
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class Equipment(models.Model):
    name_fr = models.CharField(max_length=150)
    name_en = models.CharField(max_length=150)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    photo = models.ImageField(upload_to="equipment/", blank=True, null=True)

    def __str__(self):
        return self.name_en
