export const fieldsRewardPoints = [
    'id',
    'createdTime',
    'totalSpentPoints',
    'totalGainedPoints',
    'totalAssignedPoints',
    'totalSubstractedPoints',
    'totalRefundedPoints',
    'totalAvailablePoints',
    'totalAmountInvoices',
    {
      name: 'invoices',
      fields: [
        'date',
        'invoiceNumber',
        'invoiceId',
        'paymentMade',
        {
          name: 'lineItems',
          fields: ['quantity', 'name', 'rate', 'sku', 'itemTotal'],
        },
        {
          name: 'taxes',
          fields: ['taxName', 'taxAmount'],
        },
      ],
    },
    {
      name: 'user',
      fields: ['id', 'companyName', 'firstName', 'email', 'lastName', 'phoneNumber', 'isApproved'],
    },
  ];

  export const fieldsRewardPointsHistory = [
    'id',
    'action',
    'createdTime',
    'description',
    'gainedPoints',
    'spentPoints',
    'info',
    {
      name: 'rewardPoints',
      fields: [
        'id',
        {
          name: 'user',
          fields: ['id', 'companyName', 'firstName', 'email', 'lastName', 'phoneNumber', 'isApproved'],
        }
      ],
    },
  ];