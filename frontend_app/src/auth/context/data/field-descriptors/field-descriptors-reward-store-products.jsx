export const fieldsRewardStoreProducts = [
    'assignedPoints',
    'createdTime',
    'description',
    'id',
    'lastModifiedTime',
    'name',
    'isActive',
    {
        name: 'attachments',
        fields: [
            'id',
            'file',
            'description',
            'name',
            {
                name: 'userUpload',
                fields: [
                    'id',
                    'email',
                    'firstName',
                    'lastName',
                    'username'
                ]
            }
        ]
    }
];

export const fieldsRewardStoreProductDetails = [
    'assignedPoints',
    'createdTime',
    'description',
    'id',
    'lastModifiedTime',
    'name',
    'isActive',
    {
        name: 'attachments',
        fields: [
            'id',
            'file',
            'description',
            'name',
            {
                name: 'userUpload',
                fields: [
                    'id',
                    'email',
                    'firstName',
                    'lastName',
                    'username'
                ]
            }
        ]
    },
    {
        name: 'reviews',
        fields: [
            'id',
            'createdTime',
            'lastModifiedTime',
            'rating',
            'comment',
            {
                name: 'reactions',
                fields: [
                    'id',
                    'createdTime',
                    'lastModifiedTime',
                    'reactionType',
                    {
                        name: 'user',
                        fields: [
                            'id',
                            'email',
                            'firstName',
                            'lastName',
                            'username'
                        ]
                    }
                ]
            },
            {
                name: 'user',
                fields: [
                    'id',
                    'email',
                    'firstName',
                    'lastName',
                    'username'
                ]
            }
        ]
    }
];