from django.contrib.auth.models import User
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from app.models import AutoModel

class AutoModelResource(ModelResource):
    class Meta:
        queryset = AutoModel.objects.all()
        resource_name = 'auto_model'
        authentication = SessionAuthentication()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post', 'put', 'delete']
        #detail_allowed_methods = []

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        authentication = SessionAuthentication()
        #list_allowed_methods = []
        #detail_allowed_methods = []
        excludes = ['password']