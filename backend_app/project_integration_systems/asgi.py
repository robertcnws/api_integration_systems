import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
# from api_users.ws_urls import websocket_urlpatterns as user_websocket_urlpatterns
# from api_reward_points.ws_urls import websocket_urlpatterns as reward_points_websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_integration_systems.settings')
django.setup()

# urlpatterns = user_websocket_urlpatterns + reward_points_websocket_urlpatterns
urlpatterns = []  # Assuming you will define your websocket URL patterns here

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            urlpatterns
        )
    ),
})