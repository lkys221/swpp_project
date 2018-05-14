from rest_framework import permissions

from .models import Profile


class IsSelfOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user.id == request.user.id


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author.user.id == request.user.id


class IsManufacturerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return Profile.objects.get(user=request.user).type == '1'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.manufacturer.user.id == request.user.id


class GPRegisterPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.customer.user.id == request.user.id
