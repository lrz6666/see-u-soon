"use client";
import { useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import dynamic from "next/dynamic";
import * as turf from '@turf/turf';
import citiesData from '@/public/data/data/cities.json';

const MapComponent = ({ onMapReady }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [marker1, setMarker1] = useState(null);
  const [marker2, setMarker2] = useState(null);
  const [marker3, setMarker3] = useState(null);
  const marker1Ref = useRef(null);
  const marker2Ref = useRef(null);
  const marker3Ref = useRef(null);
  const polyline1Ref = useRef(null);
  const polyline2Ref = useRef(null);

  const updatePolyline = () => {
    if (!mapInstance) return;
    // polyline1 (marker1和marker2之间)
    if (marker1Ref.current && marker2Ref.current) {
      const positions = [
        marker1Ref.current.getPosition(),
        marker2Ref.current.getPosition(),
      ];
      if (polyline1Ref.current) {
        polyline1Ref.current.setPath(positions);
      } else {
        polyline1Ref.current = new AMap.Polyline({
          path: positions,
          strokeColor: "#3366FF",
          strokeWeight: 5,
          map: mapInstance,
        });
      }
    } else if (polyline1Ref.current) {
      polyline1Ref.current.setMap(null);
      polyline1Ref.current = null;
    }

    // polyline2 (marker2和marker3之间)
    if (marker2Ref.current && marker3Ref.current) {
      const positions = [
        marker2Ref.current.getPosition(),
        marker3Ref.current.getPosition(),
      ];
      if (polyline2Ref.current) {
        polyline2Ref.current.setPath(positions);
      } else {
        polyline2Ref.current = new AMap.Polyline({
          path: positions,
          strokeColor: "#3366FF",
          strokeWeight: 5,
          map: mapInstance,
        });
      }
    } else if (polyline2Ref.current) {
      polyline2Ref.current.setMap(null);
      polyline2Ref.current = null;
    }

    // 只有marker1和marker3时也生成polyline1
    if (marker1Ref.current && marker3Ref.current && !marker2Ref.current) {
      const positions = [
        marker1Ref.current.getPosition(),
        marker3Ref.current.getPosition(),
      ];
      if (polyline1Ref.current) {
        polyline1Ref.current.setPath(positions);
      } else {
        polyline1Ref.current = new AMap.Polyline({
          path: positions,
          strokeColor: "#3366FF",
          strokeWeight: 5,
          map: mapInstance,
        });
      }
    }
  };

  useEffect(() => {
    updatePolyline();
  }, [marker1, marker2, marker3]);

  useEffect(() => {
    if (!mapInstance) return;
    console.log("AMap 是否加载:", !!window.AMap);
    console.log("AMapUI 是否加载:", !!window.AMapUI);

    AMapUI.loadUI(["misc/PoiPicker"], (PoiPicker) => {
      const picker1 = new PoiPicker({ input: "pickerInput1" });
      const picker2 = new PoiPicker({ input: "pickerInput2" });
      const picker3 = new PoiPicker({ input: "pickerInput3" });

      picker1.on("poiPicked", (poiResult) => {
        console.log(poiResult);
        if (marker1Ref.current) marker1Ref.current.setMap(null);
        const poi = poiResult.item;
        console.log(poi);
        marker1Ref.current = new AMap.Marker({
          position: poi.location,
          icon: "/poi-marker-1.png",
          map: mapInstance,
          offset: new AMap.Pixel(-25, -60),
        });
        mapInstance.setCenter(poi.location);
        setMarker1(marker1Ref.current);
      });

      picker2.on("poiPicked", (poiResult) => {
        if (marker2Ref.current) marker2Ref.current.setMap(null);
        const poi = poiResult.item;
        marker2Ref.current = new AMap.Marker({
          position: poi.location,
          icon: "/poi-marker-2.png",
          map: mapInstance,
          offset: new AMap.Pixel(-25, -60),
        });
        mapInstance.setCenter(poi.location);
        setMarker2(marker2Ref.current);
      });

      picker3.on("poiPicked", (poiResult) => {
        if (marker3Ref.current) marker3Ref.current.setMap(null);
        const poi = poiResult.item;
        marker3Ref.current = new AMap.Marker({
          position: poi.location,
          icon: "/poi-marker-3.png",
          map: mapInstance,
          offset: new AMap.Pixel(-25, -60),
        });
        mapInstance.setCenter(poi.location);
        setMarker3(marker3Ref.current);
      });
    });

    const handleMarker1Click = (ev) => {
      const lnglat = ev.lnglat;
      if (marker1Ref.current) marker1Ref.current.setMap(null);
      marker1Ref.current = new AMap.Marker({
        position: [lnglat.getLng(), lnglat.getLat()],
        icon: "/poi-marker-1.png",
        offset: new AMap.Pixel(-25, -60),
        map: mapInstance,
      });
      setMarker1(marker1Ref.current);
    };

    const handleMarker2Click = (ev) => {
      const lnglat = ev.lnglat;
      if (marker2Ref.current) marker2Ref.current.setMap(null);
      marker2Ref.current = new AMap.Marker({
        position: [lnglat.getLng(), lnglat.getLat()],
        icon: "/poi-marker-2.png",
        offset: new AMap.Pixel(-25, -60),
        map: mapInstance,
      });
      setMarker2(marker2Ref.current);
    };

    const handleMarker3Click = (ev) => {
      const lnglat = ev.lnglat;
      if (marker3Ref.current) marker3Ref.current.setMap(null);
      marker3Ref.current = new AMap.Marker({
        position: [lnglat.getLng(), lnglat.getLat()],
        icon: "/poi-marker-3.png",
        offset: new AMap.Pixel(-25, -60),
        map: mapInstance,
      });
      setMarker3(marker3Ref.current);
    };

    onMapReady({
      createMarker1: () => {
        mapInstance.off("click", handleMarker2Click);
        mapInstance.off("click", handleMarker3Click);
        mapInstance.on("click", handleMarker1Click);
      },
      createMarker2: () => {
        mapInstance.off("click", handleMarker1Click);
        mapInstance.off("click", handleMarker3Click);
        mapInstance.on("click", handleMarker2Click);
      },
      createMarker3: () => {
        mapInstance.off("click", handleMarker1Click);
        mapInstance.off("click", handleMarker2Click);
        mapInstance.on("click", handleMarker3Click);
      },
      stopListening: () => {
        mapInstance.off("click", handleMarker1Click);
        mapInstance.off("click", handleMarker2Click);
        mapInstance.off("click", handleMarker3Click);
      },
      deleteMarker: () => {
        const refsToClear = [
          marker1Ref,
          marker2Ref,
          marker3Ref,
          polyline1Ref,
          polyline2Ref,
        ];
        refsToClear.forEach((ref) => {
          if (ref.current) {
            ref.current.setMap(null);
            ref.current = null;
          }
        });
      },
      queryCities: () => {
        if (!polyline1Ref.current || !polyline2Ref.current) return [];
        
        // 获取两条折线的路径点
        const line1Path = polyline1Ref.current.getPath();
        const line2Path = polyline2Ref.current.getPath();
        
        // 转换为turf格式的线
        const line1 = turf.lineString(line1Path.map(p => [p.lng, p.lat]));
        const line2 = turf.lineString(line2Path.map(p => [p.lng, p.lat]));
        
        // 提取所有城市数据
        const allCities = citiesData.data.flatMap(province => province.cities || []);
        
        // 筛选符合条件的城市
        const nearbyCities = allCities.filter(city => {
          const cityPoint = turf.point(city.center);
          
          // 计算城市到两条线的距离(单位转换为公里)
          const distanceToLine1 = turf.pointToLineDistance(cityPoint, line1, {units: 'kilometers'});
          const distanceToLine2 = turf.pointToLineDistance(cityPoint, line2, {units: 'kilometers'});
          
          // 返回距离任意一条线50公里内的城市
          return distanceToLine1 <= 50 || distanceToLine2 <= 50;
        });
          console.log(nearbyCities)
        return nearbyCities;
      }
    });
  }, [mapInstance]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const AMapScript = document.createElement("script");
    AMapScript.src = "https://webapi.amap.com/loader.js";
    AMapScript.async = true;
    document.head.appendChild(AMapScript);

    window._AMapSecurityConfig = {
      securityJsCode: "2dda444782a3ca0e77af8378406439e8",
    };

    AMapLoader.load({
      key: "f2c2bfef42f38f023e17cea4b858ed98",
      version: "2.0",
      plugins: [
        "AMap.InfoWindow",
        "AMap.Marker",
        "AMap.Driving",
        "AMap.DistrictSearch",
      ],
      AMapUI: {
        version: "1.1",
        plugins: ["misc/PoiPicker"],
      },
    })
      .then((AMap) => {
        const newMap = new AMap.Map(mapRef.current, {
          zoom: 13,
          center: [116.397428, 39.90923],
        });
        setMapInstance(newMap);
      })
      .catch(console.error);

    return () => {
      if (mapInstance) {
        mapInstance.destroy();
        setMapInstance(null);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      <div className="w-52 h-16 bg-white z-10 absolute top-0 right-0 mt-1 mr-1 rounded-xl flex flex-col items-center justify-center space-y-2 border-1 border-gray-400">
        <input
          id="pickerInput1"
          placeholder="搜索地点..."
          className="border-gray-400 border-1 rounded-md w-3/4 text-black"
        />
        <input
          id="pickerInput2"
          placeholder="搜索地点..."
          className="border-gray-400 border-1 rounded-md w-3/4 text-black"
        />
        <input
          id="pickerInput3"
          placeholder="搜索地点..."
          className="border-gray-400 border-1 rounded-md w-3/4 text-black"
        />
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
