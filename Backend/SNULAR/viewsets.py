from rest_framework.mixins import *
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.status import *
from rest_framework.viewsets import *
from rest_framework_extensions.mixins import NestedViewSetMixin
from rest_framework.decorators import permission_classes

from .permissions import *
from .serializers import *


class ProfileViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
    GenericViewSet
):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsSelfOrReadOnly,
    ]

    def destroy(self, request, *args, **kwargs):
        profile = self.get_object()
        user = User.objects.get(id=request.user.id)

        self.perform_destroy(profile)
        self.perform_destroy(user)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        user = User.objects.get(id=request.user.id)

        profile.phone_number = request.data['phone_number']
        profile.type = request.data['type']
        profile.save()

        user.email = request.data['email']
        user.username = request.data['username']
        user.set_password(request.data['password'])
        user.save()

        return Response(status=status.HTTP_200_OK)


class ArticleViewSet(
    NestedViewSetMixin,
    ModelViewSet
):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsAuthorOrReadOnly,
    ]

    def create(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user.id)

        Article.objects.create(
            author=profile,
            title=request.data['title'],
            content=request.data['content'],
            type=request.data['type']
        )

        return Response(status=HTTP_201_CREATED)


class ArticleCommentViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    NestedViewSetMixin,
    GenericViewSet
):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

    def create(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user.id)
        article = Article.objects.get(id=kwargs['parent_lookup_article'])

        Comment.objects.create(
            author=profile,
            article=article,
            content=request.data['content']
        )
        return Response(status=HTTP_201_CREATED)


class CommentViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
    GenericViewSet
):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsAuthorOrReadOnly,
    ]


class SolarPanelViewSet(ModelViewSet):
    queryset = SolarPanel.objects.all()
    serializer_class = SolarPanelSerializer
    permission_classes = [
        IsAuthenticated,
        IsManufacturerOrReadOnly,
    ]

    def create(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user.id)

        SolarPanel.objects.create(
            manufacturer=profile,
            name=request.data['name'],
            company=request.data['company'],
            price=request.data['price'],
            power=request.data['power'],
            width=request.data['width'],
            length=request.data['length']
        )

        return Response(status=HTTP_201_CREATED)


class GPRecruitmentViewSet(ModelViewSet):
    queryset = GPRecruitment.objects.all()
    serializer_class = GPRecruitmentSerializer
    permission_classes = [
        IsAuthenticated,
        IsManufacturerOrReadOnly,
    ]

    def create(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user.id)
        solar_panel = SolarPanel.objects.get(id=request.data['solar_panel'],)

        GPRecruitment.objects.create(
            manufacturer=profile,
            solar_panel=solar_panel,
            min_panel=request.data['min_panel'],
            discounted_price=request.data['discounted_price']
        )

        return Response(status=HTTP_201_CREATED)


class GPRegisterViewSet(ModelViewSet):
    queryset = GPRegister.objects.all()
    serializer_class = GPRegisterSerializer
    permission_classes = [
        IsAuthenticated,
        GPRegisterPermission,
    ]

    def create(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user.id)
        gp_recruitment = GPRecruitment.objects.get(id=request.data['gp_recruitment'],)

        GPRegister.objects.create(
            customer=profile,
            num_panel=request.data['num_panel'],
            gp_recruitment=gp_recruitment
        )

        return Response(status=HTTP_201_CREATED)
