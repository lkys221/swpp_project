from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import NestedRouterMixin

from .views import *
from .viewsets import *


class NestedDefaultRouter(NestedRouterMixin, DefaultRouter):
    pass


router = DefaultRouter()

router.register('profile', ProfileViewSet, base_name='profile')
router.register('article', ArticleViewSet, base_name='article')
router.register('comment', CommentViewSet, base_name='comment')
router.register('panel', SolarPanelViewSet, base_name='panel')
router.register('gp_recruitment', GPRecruitmentViewSet, base_name='gp_recruitment')
router.register('gp_register', GPRegisterViewSet, base_name='gp_register')

nest_router = NestedDefaultRouter()

authors_router = nest_router.register('article', ArticleViewSet)
authors_router.register(
    'comment', ArticleCommentViewSet,
    base_name='article-comment',
    parents_query_lookups=['article'])

urlpatterns = [
    url(r'', include(router.urls)),
    url(r'', include(nest_router.urls)),
    url('^signup/?$', SignUpView.as_view(), name='sign_up'),
    url('^signin/?$', SignInView.as_view(), name='sign_in'),
    url('^signout/?$', SignOutView.as_view(), name='sign_out'),
    url('^panel/(?P<panel_id>[0-9]+)/image/?$', SolarPanelImageView.as_view(), name='solar_image')
]
