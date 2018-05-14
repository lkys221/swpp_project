from rest_framework import serializers

from .models import *


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField()
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def to_representation(self, obj):
        user = User.objects.get(user_profile=obj.id)
        return {
            'id': obj.id,
            'user_id': user.id,
            'email': user.email,
            'username': user.username,
            'password': user.password,
            'phone_number': obj.phone_number,
            'type': obj.type
        }

    class Meta:
        model = Profile
        fields = ('id', 'email', 'username', 'password', 'phone_number', 'type')


class ArticleSerializer(serializers.ModelSerializer):
    def to_representation(self, obj):
        return {
            'id': obj.id,
            'author': obj.author.id,
            'title': obj.title,
            'content': obj.content,
            'create_time': obj.create_time,
            'type': obj.type
        }

    class Meta:
        model = Article
        fields = ('id', 'title', 'content', 'type')


class CommentSerializer(serializers.ModelSerializer):
    def to_representation(self, obj):
        return {
            'id': obj.id,
            'author': obj.author.id,
            'article': obj.article.id,
            'content': obj.content,
            'create_time': obj.create_time,
        }

    class Meta:
        model = Comment
        fields = ('id', 'content')


class SolarPanelSerializer(serializers.ModelSerializer):
    def to_representation(self, obj):
        efficiency = float(obj.power) / (float(obj.width) * float(obj.length) * 1019.327)
        return {
            'id': obj.id,
            'manufacturer': obj.manufacturer.id,
            'name': obj.name,
            'company': obj.company,
            'price': obj.price,
            'power': obj.power,
            'width': obj.width,
            'length': obj.length,
            'image': obj.image.url,
            'efficiency': efficiency
        }

    class Meta:
        model = SolarPanel
        fields = ('id', 'name', 'company', 'price', 'power', 'width', 'length')


class SolarPanelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolarPanel
        fields = ('id', 'image')


class GPRecruitmentSerializer(serializers.ModelSerializer):
    def to_representation(self, obj):
        num_requested_panel = 0
        gp_registers = GPRegister.objects.filter(gp_recruitment=obj.id)

        for gp_register in gp_registers:
            num_requested_panel += gp_register.num_panel

        return {
            'id': obj.id,
            'manufacturer': obj.manufacturer.id,
            'solar_panel': obj.solar_panel.id,
            'min_panel': obj.min_panel,
            'discounted_price': obj.discounted_price,
            'num_requested_panel': num_requested_panel
        }

    class Meta:
        model = GPRecruitment
        fields = ('id', 'solar_panel', 'min_panel', 'discounted_price')


class GPRegisterSerializer(serializers.ModelSerializer):
    def to_representation(self, obj):
        return {
            'id': obj.id,
            'customer': obj.customer.id,
            'num_panel': obj.num_panel,
            'gp_recruitment': obj.gp_recruitment.id
        }

    class Meta:
        model = GPRegister
        fields = ('id', 'num_panel', 'gp_recruitment')


class SignUpSerializer(serializers.Serializer):
    USER_TYPE_CHOICES = (
        ('0', 'Customer'),
        ('1', 'Manufacturer'),
        ('2', 'Admin')
    )

    email = serializers.CharField()
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})
    phone_number = serializers.CharField(max_length=13)
    type = serializers.ChoiceField(choices=USER_TYPE_CHOICES, default='0')

    class Meta:
        fields = ('email', 'username', 'password', 'phone_number', 'type')


class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    class Meta:
        fields = ('username', 'password')
