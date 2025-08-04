// src/context/RouteContext.js
import { useLocation } from 'react-router-dom';
import React, { useMemo, useEffect, createContext } from 'react';

const RouteContext = createContext();

const RouteProvider = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        const mapRoutesKeys = [
            {
                subtext: 'item',
                keys: [
                    'itemPage',
                    'itemRowsPerPage'
                ]
            },
            {
                subtext: 'order',
                keys: [
                    'orderPage',
                    'orderRowsPerPage',
                    'startDate',
                    'endDate'
                ]
            },
        ]

        const currentPath = location.pathname;

        mapRoutesKeys.forEach(({ subtext, keys }) => {
            keys.forEach((key) => {
                if (!currentPath.includes(subtext)) {
                    if (!localStorage.getItem('routeByOrder') || !localStorage.getItem('routeByAnalytics') ||
                         !localStorage.getItem('routeByShipment') || !localStorage.getItem('routeByShipmentBySku')) {
                        localStorage.removeItem(key);
                        // console.log(
                        //     `Se eliminó '${key}' de localStorage porque la ruta '${currentPath}' no contiene '${subtext}'.`
                        // );
                    }
                }
            });
        });
    }, [location.pathname]);

    const value = useMemo(
        () => ({ location }),
        [location]
      );

    return (
        <RouteContext.Provider value={value}>
            {children}
        </RouteContext.Provider>
    );
};

export { RouteContext, RouteProvider };
