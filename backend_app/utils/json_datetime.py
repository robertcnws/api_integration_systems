import graphene
import orjson
from bson import ObjectId
from datetime import datetime
# from api_projects.data_util import serialize_datetime
from datetime import datetime, timezone as dt_timezone
from django.utils import timezone


class JSONDateTime(graphene.Scalar):
    """
    Serializa dicts/lists anidados, aplicando
    datetime_to_timezone a cada datetime.
    """
    @staticmethod
    def serialize(value):
        dumped = orjson.dumps(
            value,
            default=lambda obj: serialize_all(obj) if isinstance(obj, (datetime, dict, list, tuple, set)) else str(obj),
            option=orjson.OPT_SERIALIZE_NUMPY | orjson.OPT_NON_STR_KEYS | orjson.OPT_UTC_Z | orjson.OPT_INDENT_2
        )
        return orjson.loads(dumped)

    @staticmethod
    def parse_value(value):
        return value

    @staticmethod
    def parse_literal(ast, variables=None):
        return ast.value
    
def serialize_all(value):
    """
    Serializes a value, converting datetime objects to strings
    in the format 'YYYY-MM-DD HH:MM:SS'.
    """
    if isinstance(value, datetime):
        return datetime_to_timezone(value)
    elif isinstance(value, dict):
        return {key: serialize_all(val) for key, val in value.items()}
    elif isinstance(value, list):
        return [serialize_all(item) for item in value]
    elif isinstance(value, tuple):
        return tuple(serialize_all(item) for item in value)
    elif isinstance(value, set):
        return {serialize_all(item) for item in value}
    elif isinstance(value, str):
        try:
            dt = datetime.fromisoformat(value)
            return datetime_to_timezone(dt)
        except ValueError:
            return value
    elif isinstance(value, (int, float, bool)):
        return value
    elif isinstance(value, ObjectId):
        return str(value)
    else:
        return value
    

def datetime_to_timezone(dt):
    if not dt:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=dt_timezone.utc)
    try:
        local_dt = dt.astimezone(timezone.get_default_timezone())
        return local_dt.strftime('%Y-%m-%d %H:%M:%S')
    except Exception:
        if isinstance(dt, datetime):
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        return dt
    
    
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