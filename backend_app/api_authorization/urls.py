from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from . import views
import api_authorization.schema as schema
import graphene

urlpatterns = [
    path(
        "graphql/", 
        csrf_exempt(GraphQLView.as_view(schema=graphene.Schema(query=schema.Query), graphiql=True)), 
        name="graphql"
    ),
    path("is_user_verified/", views.is_user_verified, name="is_user_verified"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path('register/', views.register, name='register'),
    path('verify_user/', views.verify_user, name='verify_user'),
    path('send_verification_code/', views.send_verification_code, name='send_verification_code'),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.MyTokenRefreshView.as_view(), name='token_refresh'),
]