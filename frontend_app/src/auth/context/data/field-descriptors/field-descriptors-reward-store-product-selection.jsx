import { fieldsRewardStoreProducts } from "./field-descriptors-reward-store-products"

const fieldDesctiptorsRewardStoreProductSelection = [
    'createdTime',
    'id',
    'lastModifiedTime',
    'quantity',
    {
        name: 'storeProduct',
        fields: fieldsRewardStoreProducts
    },
    {
        name: 'user',
        fields: [
            'id',
            'username',
            'firstName',
            'lastName'
        ]
    }
]

export const fieldsRewardStoreProductSelectionCarts = [
    'createdTime',
    'id',
    'isBought',
    'lastModifiedTime',
    {
        name: 'storeProductSelection',
        fields: fieldDesctiptorsRewardStoreProductSelection
    }
]

export const fieldsRewardStoreProductSelectionBuys = [
    'createdTime',
    'id',
    'hasBeenUsed',
    'hasRequestedRefund',
    'quantityUsed',
    'orderNumber',
    'confirmationNumber',
    'pinNumber',
    'notes',
    'purchaseType',
    'purchaseFraction',
    'lastModifiedTime',
    'expirationTime',
    'redeemedTime',
    'isRemoved',
    {
        name: 'storeProductSelection',
        fields: fieldDesctiptorsRewardStoreProductSelection
    }
]