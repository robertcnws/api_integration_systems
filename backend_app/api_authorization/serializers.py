# api_authorization/serializers.py
from datetime import datetime, timezone as dt_timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # print('data', data)
        
        remember = self.context['request'].data.get('rememberMe', False)
        
        # print('remember', remember)
        
        # print('self.user', self.user)
        
        if remember:
            access_life  = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME_REMEMBER']
            refresh_life = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME_REMEMBER']
        else:
            access_life  = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
            refresh_life = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
            
        now = datetime.now(dt_timezone.utc)
        
        orig_refresh = RefreshToken(data['refresh'])
        
        orig_refresh.set_exp(from_time=now, lifetime=refresh_life)
        
        new_access = orig_refresh.access_token
        
        new_access.set_exp(from_time=now, lifetime=access_life)
        
        data['refresh'] = str(orig_refresh)
        data['access']  = str(new_access)
        return data
    
    
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import RevokedToken

class RevocationCheckTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh_token = attrs['refresh']
        from rest_framework_simplejwt.tokens import UntypedToken, TokenError

        try:
            token = UntypedToken(refresh_token)
            jti   = token['jti']
        except TokenError:
            raise AuthenticationFailed('Invalid refresh token')

        if RevokedToken.objects(jti=jti).first():
            raise AuthenticationFailed('Refresh token has been revoked')
        
        return super().validate(attrs)
