import { fieldsLoginUsers } from './field-descriptors-login-users';
import { fieldsNotifications } from './field-descriptors-notifications';

export const fieldsNotificationUsers = [
    'count',
    'page',
    'pageSize',
    {
        name: 'results',
        fields: [
            'createdTime',
            'id',
            'lastModifiedTime',
            'read',
            'username',
            {
                name: 'notification',
                fields: fieldsNotifications
            },
            {
                name: 'user',
                fields: fieldsLoginUsers
            }
        ]
    }
]