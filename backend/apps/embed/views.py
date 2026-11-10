"""Aiuna Growth embed sessions: create a multi-page design + edit share link for iframe use."""

from __future__ import annotations

from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.designs.serializers import DocumentField
from apps.designs.services import create_design
from apps.sharing.models import ShareLink, ShareRole
from apps.sharing.services import create_link
from apps.sharing.serializers import ShareLinkCreateSerializer


class EmbedSessionSerializer(serializers.Serializer):
    title = serializers.CharField(required=False, max_length=200, default="Arte Aiuna")
    document = DocumentField()
    lang = serializers.ChoiceField(choices=["pt", "en"], required=False, default="pt")
    expires_hours = serializers.IntegerField(required=False, min_value=1, max_value=24 * 30, default=72)


class EmbedSessionView(APIView):
    """POST /api/v1/embed/sessions/ — authenticated; returns an edit URL safe for Growth iframe."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EmbedSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        design = create_design(
            request.user,
            title=data["title"],
            document=data["document"],
        )
        expires_at = timezone.now() + timedelta(hours=data["expires_hours"])
        link_serializer = ShareLinkCreateSerializer(
            data={
                "role": ShareRole.EDIT,
                "expires_at": expires_at.isoformat().replace("+00:00", "Z"),
            }
        )
        link_serializer.is_valid(raise_exception=True)
        link: ShareLink = create_link(design, link_serializer, request.user)
        lang = data["lang"]
        editor_path = f"/s/{link.token}?embed=1&lang={lang}"
        return Response(
            {
                "design_id": str(design.id),
                "share_token": link.token,
                "editor_path": editor_path,
                "page_count": design.page_count,
            },
            status=status.HTTP_201_CREATED,
        )
