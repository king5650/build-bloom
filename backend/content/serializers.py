from rest_framework import serializers

from .models import Equipment, Project, ProjectImage, TeamMember


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "is_before_after", "order"]


class ProjectListSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    before_image = serializers.SerializerMethodField()
    after_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "slug", "title_fr", "title_en", "category", "location",
            "cover_image", "before_image", "after_image",
        ]

    def get_cover_image(self, obj):
        first = obj.images.first()
        return first.image.url if first else None

    def get_before_image(self, obj):
        image = obj.images.filter(is_before_after=True).first()
        return image.image.url if image else None

    def get_after_image(self, obj):
        images = obj.images.filter(is_before_after=True)
        image = images[1] if len(images) > 1 else None
        return image.image.url if image else None


class ProjectDetailSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "slug", "title_fr", "title_en", "description_fr", "description_en",
            "category", "location", "completed_date", "images",
        ]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ["id", "name", "role_fr", "role_en", "bio_fr", "bio_en", "photo"]


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ["id", "name_fr", "name_en", "description_fr", "description_en", "photo"]
