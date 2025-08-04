from bson.objectid import ObjectId
from mongoengine import Document
from mongoengine.fields import ReferenceField, ListField
from mongoengine.queryset import QuerySet
from django.utils import timezone
from datetime import timezone as dt_timezone
from datetime import datetime
from dateutil import parser
from phonenumbers import NumberParseException
from api_authorization.models import (
    LoginUser,
    Notification, 
    NotificationUser,
    Tracking
)
import phonenumbers
import json

def to_camel(snake_str: str) -> str:
    parts = snake_str.split('_')
    return parts[0] + ''.join(p.title() for p in parts[1:])

def camelize(obj):
    if isinstance(obj, dict):
        new = {}
        for k, v in obj.items():
            new_key = to_camel(k.lstrip('_'))
            new[new_key] = camelize(v)
        return new
    if isinstance(obj, list):
        return [camelize(item) for item in obj]
    return obj

def transform_data_to_mongo(obj, exclude_fields=None, include_fields=None, _seen=None):
    """
    Serializa cualquier Document de MongoEngine o estructuras anidadas,
    convierte ObjectId a str, y para ReferenceFields y ListField<ReferenceField>
    recupera y serializa el documento referenciado.
    """
    if _seen is None:
        _seen = set()
    
    if isinstance(obj, QuerySet):
        return transform_data_to_mongo(list(obj), exclude_fields, include_fields, _seen)

    # 1) Si nos pasaron un Document, arrancamos desde ahí
    elif isinstance(obj, Document):
        pk = obj.pk
        # evitar ciclos
        if pk in _seen:
            return str(pk)
        _seen.add(pk)
        data = obj.to_mongo().to_dict()
        parent = obj

    # 2) Si es un dict plano
    elif isinstance(obj, dict):
        data = obj
        parent = None

    # 3) Si es una lista, la procesamos por ítem
    elif isinstance(obj, list):
        return [transform_data_to_mongo(item, exclude_fields, include_fields, _seen)
                for item in obj]

    # 4) Cualquier otro tipo (string, número, etc.)
    else:
        return obj

    out = {}
    for key, val in data.items():
        # ———— ObjectId suelto ————
        if isinstance(val, ObjectId):
            # ¿Es ReferenceField en el modelo padre?
            field = getattr(parent, '_fields', {}).get(key)
            if isinstance(field, ReferenceField):
                # cargo el documento apuntado
                ref_cls = field.document_type
                ref_doc = ref_cls.objects(id=val).first()
                out[key] = transform_data_to_mongo(ref_doc, exclude_fields, include_fields, _seen)
            else:
                out[key] = str(val)

        # ———— Lista ————
        elif isinstance(val, list):
            field = getattr(parent, '_fields', {}).get(key)
            # ¿es ListField de ReferenceField?
            if isinstance(field, ListField) and isinstance(field.field, ReferenceField):
                ref_cls = field.field.document_type
                out[key] = [
                    transform_data_to_mongo(ref_cls.objects(id=v).first(), exclude_fields, include_fields, _seen)
                    if isinstance(v, ObjectId) else transform_data_to_mongo(v, exclude_fields, include_fields, _seen)
                    for v in val
                ]
            else:
                # lista de otros tipos
                out[key] = [transform_data_to_mongo(item, exclude_fields, include_fields, _seen) for item in val]

        # ———— Sub‐dict anidado ————
        elif isinstance(val, dict):
            out[key] = transform_data_to_mongo(val, exclude_fields, include_fields, _seen)

        # ———— Cualquier otro ————
        else:
            out[key] = val

    # Aplicar exclude/include
    if exclude_fields:
        for f in exclude_fields:
            out.pop(f, None)
    if include_fields:
        out = {k: out[k] for k in include_fields if k in out}

    return out

# def transform_data_to_mongo(data, exclude_fields=None, include_fields=None):
#     if isinstance(data, dict):
#         for key, value in data.items():
#             data[key] = transform_data_to_mongo(str(value) if isinstance(value, ObjectId) else value)
#         if not 'id' in data and '_id' in data:
#             data['id'] = data.get('_id', None)
#     else:
#         data = data.to_mongo().to_dict()
#         if '_id' in data and isinstance(data['_id'], ObjectId):
#             data['_id'] = str(data['_id'])
#             data['id'] = data['_id']
#     if exclude_fields:
#         for field in exclude_fields:
#             if field in data:
#                 del data[field]
#     if include_fields:
#         for field in list(data.keys()):
#             if field not in include_fields:
#                 del data[field]
#     return data


def transform_dict_to_camelcase(data):
    if isinstance(data, dict):
        new_data = {}
        for key, value in data.items():
            if '_' in key and key != '_id':
                words = key.split('_')
                new_key = words[0].lower() + ''.join(word.capitalize() for word in words[1:])
            else:
                new_key = key[0].lower() + key[1:] if key else key
            new_data[new_key] = transform_dict_to_camelcase(value)
        return new_data
    elif isinstance(data, list):
        return [transform_dict_to_camelcase(item) for item in data]
    else:
        return data


def serialize_datetime(value):
    if isinstance(value, datetime):
        if timezone.is_naive(value):
            local_tz = timezone.get_current_timezone()
            # local_tz = dt_timezone.utc
            value = timezone.make_aware(value, local_tz) 
        local_dt = timezone.localtime(value)  
        return local_dt.isoformat()
    elif isinstance(value, dict):
        return {key: serialize_datetime(val) for key, val in value.items()}
    elif isinstance(value, list):
        return [serialize_datetime(item) for item in value]
    else:
        return value
    
    
def dynamic_field_to_json(data):
    if isinstance(data, str):
        try:
            return json.loads(data)
        except Exception:
            return data
    return data


def parse_custom_date(logger, date_str):
    try:
        if not date_str:
            return None
        if isinstance(date_str, datetime):
            return date_str
        return parser.parse(date_str)
    except Exception as e:
        if logger:
            logger.warning(f'Error parsing date: {e}')
        return None
    
    
def to_aware(dt):
    if isinstance(dt, str):
        dt = parse_custom_date(None, dt)
    if dt is None:
        return dt
    if dt.tzinfo is None:
        return timezone.make_aware(dt, timezone.get_default_timezone())
    return timezone.localtime(dt)


def create_notification(module, info_id, info, type, username):
    notification = Notification(
        module=module,
        info_id=str(info_id),
        info=info,
        type=type,
        created_time=timezone.now(),
        last_modified_time=timezone.now(),
    )
    
    notification.save()
    
    user = LoginUser.objects(username=username).first()
    
    username = user.username if user else 'System Job'
    
    all_users = LoginUser.objects(username__ne=username, is_active=True, is_verified=True).all()
    
    if notification:
        for user in all_users:
            user_notification = NotificationUser(
                notification=notification,
                username=username,
                user=user,
                created_time=timezone.now(),
                last_modified_time=timezone.now(),
            )
            user_notification.save()
            
            
def create_tracking(user_reporter, action, object_id=None, object_type=None, object_name=None, managed_data=None):
    tracking = Tracking(
        user_reporter=user_reporter,
        action=action,
        object_id=object_id if object_id and isinstance(object_id, str) else str(object_id),
        object_type=object_type,
        object_name=object_name,
        created_time=timezone.now(),
        managed_data=managed_data
    )
    tracking.save()


def get_national_phone_number(raw_number: str) -> str:
    try:
        phone = phonenumbers.parse(raw_number, None)
        return str(phone.national_number)
    except NumberParseException as e:
        raise ValueError(f"Número inválido: {e}")


class DateTimeJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            if timezone.is_naive(o):
                o = timezone.make_aware(o, dt_timezone.utc)
            return timezone.localtime(o).isoformat()
        return super().default(o)

def serializing_datetime(obj):
    return json.loads(json.dumps(obj, cls=DateTimeJSONEncoder))
