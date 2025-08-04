# api_authorization/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import RevokedToken

class RevocationCheckJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        validated_token = super().get_validated_token(raw_token)
        jti = validated_token.get('jti')
        if RevokedToken.objects(jti=jti).first():
            raise AuthenticationFailed('Token has been revoked')
        return validated_token
