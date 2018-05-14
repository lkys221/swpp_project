from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.status import *
from rest_framework.views import APIView

from .serializers import *
from .permissions import IsManufacturerOrReadOnly


class SignUpView(APIView):
    serializer_class = SignUpSerializer
    permission_classes = []

    def post(self, request):
        try:
            email = request.data['email']
            username = request.data['username']
            password = request.data['password']
            phone_number = request.data['phone_number']
            profile_type = request.data['type']
        except Exception as error:
            handle_exception(error)
            return Response(status=HTTP_406_NOT_ACCEPTABLE)
        else:
            if profile_type == '2':
                new_user = User.objects.create_superuser(email=email, username=username, password=password)
            else:
                new_user = User.objects.create_user(email=email, username=username, password=password)

            Profile.objects.create(user=new_user, phone_number=phone_number, type=profile_type)
            return Response(status=HTTP_201_CREATED)


class SignInView(APIView):
    serializer_class = SignInSerializer
    permission_classes = []

    def post(self, request):
        try:
            username = request.data['username']
            password = request.data['password']
        except Exception as error:
            handle_exception(error)
            return Response(status=HTTP_406_NOT_ACCEPTABLE)
        else:
            login_user = authenticate(username=username, password=password)

            if login_user is not None:
                login(request, login_user)
                return Response(status=HTTP_202_ACCEPTED)
            else:
                return Response(status=HTTP_401_UNAUTHORIZED)


class SignOutView(APIView):
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):
        logout(request)
        return Response(status=HTTP_202_ACCEPTED)


class SolarPanelImageView(APIView):
    serializer_class = SolarPanelImageSerializer
    # permission_classes = [
    #     IsAuthenticatedOrReadOnly,
    #     IsManufacturerOrReadOnly
    # ]

    def get(self, request, *args, **kwargs):
        print(request.user)
        panel = SolarPanel.objects.get(id=kwargs['panel_id'])
        serializer = SolarPanelSerializer(panel)
        return Response(data=serializer.data)

    def post(self, request, *args, **kwargs):
        print(request.user)
        print(request.data)
        panel = SolarPanel.objects.get(id=kwargs['panel_id'])
        panel.image = request.data['image']
        panel.save()
        return Response(status=HTTP_200_OK)


def handle_exception(error):
    pass
