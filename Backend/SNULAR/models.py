from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    USER_TYPE_CHOICES = (
        ('0', 'Customer'),
        ('1', 'Manufacturer'),
        ('2', 'Admin')
    )

    user = models.OneToOneField(User, related_name='user_profile', on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=13)
    type = models.CharField(max_length=1, choices=USER_TYPE_CHOICES, default='0')

    def __str__(self):
        return self.user.username


class Article(models.Model):
    ARTICLE_TYPE_CHOICES = (
        ('0', 'Notice'),
        ('1', 'Forum'),
        ('2', 'FAQ')
    )

    author = models.ForeignKey(Profile, related_name='wrote_article', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    create_time = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=1, choices=ARTICLE_TYPE_CHOICES, default='0')

    def __str__(self):
        return self.title


class Comment(models.Model):
    author = models.ForeignKey(Profile, related_name='wrote_comment', on_delete=models.CASCADE)
    article = models.ForeignKey(Article, related_name='article_comment', on_delete=models.CASCADE)
    content = models.CharField(max_length=200)
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content


class SolarPanel(models.Model):
    manufacturer = models.ForeignKey(Profile, related_name='registered_panel', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=50)
    price = models.PositiveIntegerField(default=0)
    power = models.PositiveIntegerField(default=0)
    width = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    length = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    image = models.ImageField('Upload image', default='default_image.jpg')

    def __str__(self):
        return self.name


class GPRecruitment(models.Model):
    manufacturer = models.ForeignKey(Profile, related_name='recruiting_gp', on_delete=models.CASCADE)
    solar_panel = models.ForeignKey(SolarPanel, related_name='recruiting_gp', on_delete=models.CASCADE)
    min_panel = models.PositiveIntegerField(default=0)
    discounted_price = models.PositiveIntegerField(default=0)

    def __str__(self):
        return 'Recruiting ' + str(self.min_panel) + ' ' + str(self.solar_panel) + ' by ' + str(self.manufacturer)


class GPRegister(models.Model):
    customer = models.ForeignKey(Profile, related_name='registered_gp', on_delete=models.CASCADE)
    num_panel = models.PositiveIntegerField(default=0)
    gp_recruitment = models.ForeignKey(GPRecruitment, related_name='registered_gp', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.customer) + ' registered ' + str(self.num_panel) + ' ' + str(self.gp_recruitment.solar_panel)
