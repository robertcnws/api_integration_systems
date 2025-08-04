import mongoengine
from mongoengine import (
    Document, 
    StringField, 
    BooleanField, 
    DateTimeField, 
    DynamicField,
    ReferenceField,
)
from django.contrib.auth.hashers import (
    make_password, 
    check_password
)
from datetime import datetime, timezone

class UserRole(Document):
    name = StringField(max_length=50, unique=True, required=True)
    description = StringField(required=False)
    is_active = BooleanField(default=True, required=False)
    created_time = DateTimeField(default=lambda: datetime.now(timezone.utc), required=False)
    last_modified_time = DateTimeField(default=lambda: datetime.now(timezone.utc), required=False)

    meta = {
        'collection': 'user_role',
        'indexes': ['name'],
    }

    def __str__(self):
        return self.name
    
    
class LoginUser(Document):
    username = StringField(max_length=150, unique=True, required=True)
    first_name = StringField(max_length=30, required=False)
    last_name = StringField(max_length=30, required=False)
    company_name = StringField(max_length=100, required=False)
    email = StringField(max_length=254, required=False)
    is_staff = BooleanField(default=False, required=False)
    is_active = BooleanField(default=True, required=False)
    created_time = DateTimeField(default=mongoengine.fields.DateTimeField().default, required=False)
    last_modified_time = DateTimeField(default=mongoengine.fields.DateTimeField().default, required=False)
    phone_number = StringField(max_length=50, required=False)
    password = StringField(required=True)
    last_login = DateTimeField(default=mongoengine.fields.DateTimeField().default, required=False)
    date_joined = DateTimeField(default=mongoengine.fields.DateTimeField().default, required=False)
    token = StringField(max_length=255, required=False)
    user_role = ReferenceField(UserRole, required=False, reverse_delete_rule=2) 
    avatar_url = StringField(max_length=255, required=False)
    is_verified = BooleanField(default=False, required=False)
    is_approved = BooleanField(default=False, required=False)

    meta = {
        'collection': 'login_users',
        'indexes': ['username', 'email', 'phone_number'],
    }

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def __str__(self):
        return self.username
    

class LoginUserVerificationCode(Document):
    user = ReferenceField(LoginUser, required=True, reverse_delete_rule=2)  # CASCADE
    code = StringField(required=True, max_length=6)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    expires_at = DateTimeField()

    def is_expired(self):
        now = datetime.now(timezone.utc)
        expires = self.expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        return now > expires
    
    
class RevokedToken(Document):
    jti          = StringField(required=True, unique=True)
    revoked_at   = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'revoked_tokens',
        'indexes': ['jti']
    }
    

class Notification(Document):
    module = StringField(max_length=255, null=True)
    info = StringField(null=True)
    info_id = StringField(max_length=255, null=True)
    created_time = DateTimeField(default=lambda: datetime.now(timezone.utc), null=True)
    last_modified_time = DateTimeField(default=lambda: datetime.now(timezone.utc), null=True)
    type = StringField(max_length=255, null=True, default='load')
    meta = {
        'collection': 'notification',
        'indexes': [
            'module', 'info', 'created_time', 'last_modified_time', 'type', 'info_id'
        ],
        'verbose_name': 'Notification',
        'verbose_name_plural': 'Notifications'
    }
    def __str__(self):
        return self.info
    
class NotificationUser(Document):
    notification = ReferenceField(Notification, required=True, reverse_delete_rule=2)  # CASCADE
    username = StringField(max_length=255, required=True)
    user = ReferenceField(LoginUser, null=True, reverse_delete_rule=2)  # CASCADE
    read = BooleanField(default=False)
    created_time = DateTimeField(default=lambda: datetime.now(timezone.utc), null=True)
    last_modified_time = DateTimeField(default=lambda: datetime.now(timezone.utc), null=True)
    meta = {
        'collection': 'notification_user',
        'indexes': [
            'username', 'read', 'created_time', 'last_modified_time'
        ],
        'verbose_name': 'Notification User',
        'verbose_name_plural': 'Notification Users'
    }
    def __str__(self):
        return f'{self.username} - {self.notification.info}'
    
    
class Tracking(Document):
    user_reporter = ReferenceField(LoginUser, required=True, reverse_delete_rule=2)  # CASCADE
    object_id = StringField(required=True, null=True, blank=True)  # Optional field for object ID
    object_type = StringField(required=True, null=True, blank=True)  # Optional field
    object_name = StringField(required=True, null=True, blank=True)  # Optional field for object name
    action = StringField(required=True)
    created_time = DateTimeField(default=lambda: datetime.now(timezone.utc), null=True)
    managed_data = DynamicField(null=True)
    
    meta = {
        'collection': 'tracking',
        'indexes': [
            'user_reporter', 'action', 'created_time', 'object_id', 'object_type', 'object_name'
        ],
        'verbose_name': 'Tracking',
        'verbose_name_plural': 'Trackings'
    }
    
    def __str__(self):
        return self.action