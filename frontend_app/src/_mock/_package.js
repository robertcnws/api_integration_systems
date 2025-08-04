import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

import { CONFIG } from 'src/config-global';

const GET_ZOHO_PACKAGES = gql`
  query GetZohoPackages($shipmentId: String, $packageId: String, $listPackagesId: [String!]) {
    allZohoPackages(shipmentId: $shipmentId, packageId: $packageId, listPackagesId: $listPackagesId) {
      packageId
      salesorderId
      salesorderNumber
      salesorderDate
      salesChannel
      salesChannelFormatted
      salesorderFulfilmentStatus
      shipmentId
      shipmentNumber
      shipmentOrder
      packageNumber
      date
      shippingDate
      deliveryMethod
      deliveryMethodId
      trackingNumber
      trackingLink
      expectedDeliveryDate
      shipmentDeliveredDate
      status
      detailedStatus
      statusMessage
      carrier
      service
      deliveryDays
      deliveryGuarantee
      totalQuantity
      customerId
      customerName
      email
      phone
      mobile
      contactPersons
      createdById
      lastModifiedById
      createdTime
      lastModifiedTime
      notes
      terms
      isEmailed
      isAdvancedTrackingMissing
      lineItems
      customFields
      customFieldHash
      shipmentorderCustomFields
      billingAddress
      shippingAddress
      picklists
      templateId
      templateName
      templateType
    }
  }
`;

export const usePackagesQuery = (shipmentId, packageId, listPackagesId) => {
  const { loading, error, data, startPolling, stopPolling } = useQuery(GET_ZOHO_PACKAGES, {
    variables: { shipmentId, packageId, listPackagesId },
  });

  useEffect(() => {
    startPolling(CONFIG.pollingInterval); 
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);
  
  return { loading, error, data: data?.allZohoPackages };
};
