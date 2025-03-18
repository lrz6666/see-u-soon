'use client'
import { useEffect, useState } from 'react';
import MapContext from '../../context/MapContext';

const MapProvider = ({ children }) => {
  const [AMap, setAMap] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const AMapScript = document.createElement('script');
    AMapScript.src = 'https://webapi.amap.com/loader.js';
    AMapScript.async = true;
    document.head.appendChild(AMapScript);

    window._AMapSecurityConfig = {
      securityJsCode: '2dda444782a3ca0e77af8378406439e8',
    };

    AMapScript.onload = () => {
      window.AMapLoader.load({
        key: 'f2c2bfef42f38f023e17cea4b858ed98',
        version: '2.0',
      })
        .then((AMap) => {
          setAMap(AMap);
          setIsLoading(false);
        })
        .catch((e) => {
          setError(e);
          setIsLoading(false);
        });
    };

    return () => {
      if (AMapScript) {
        document.head.removeChild(AMapScript);
      }
    };
  }, []);

  return (
    <MapContext.Provider value={{ AMap, mapInstance, isLoading, error }}>
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
