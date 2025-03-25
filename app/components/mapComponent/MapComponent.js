"use client";
import { useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import dynamic from "next/dynamic";
const MapComponent = ({ onMapReady }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    AMapLoader.load({
      key: "f2c2bfef42f38f023e17cea4b858ed98",
      version: "2.0",
      plugins: ["AMap.InfoWindow", "AMap.Marker", "AMap.Driving"],
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
        //引入驾车路线，以及周边城市提示
        const driving = new AMap.Driving();
        // 初始化标记和事件
        let newMarker1 = null;
        let newMarker2 = null;

        const handleMarker1Click = (ev) => {
          const lnglat = ev.lnglat;
          if (newMarker1) newMarker1.setMap(null);
          newMarker1 = new AMap.Marker({
            position: [lnglat.getLng(), lnglat.getLat()],
            icon: "/poi-marker-1.png",
            offset: new AMap.Pixel(-25, -60),
            map: newMap,
          });
        };

        const handleMarker2Click = (ev) => {
          const lnglat = ev.lnglat;
          if (newMarker2) newMarker2.setMap(null);
          newMarker2 = new AMap.Marker({
            position: [lnglat.getLng(), lnglat.getLat()],
            icon: "/poi-marker-2.png",
            offset: new AMap.Pixel(-25, -60),
            map: newMap,
          });
        };

        // 初始化POI选择器
        AMapUI.loadUI(["misc/PoiPicker"], (PoiPicker) => {
          const picker1 = new PoiPicker({ input: "pickerInput1" });
          const picker2 = new PoiPicker({ input: "pickerInput2" });
          picker1.on("poiPicked", (poiResult) => {
            if (newMarker1) newMarker1.setMap(null);
            const poi = poiResult.item;
            newMarker1 = new AMap.Marker({
              position: poi.location,
              icon: "/poi-marker-1.png",
              map: newMap,
            });

            newMap.setCenter(poi.location);
          });
          picker2.on("poiPicked", (poiResult) => {
            if (newMarker2) newMarker2.setMap(null);
            const poi = poiResult.item;
            newMarker2 = new AMap.Marker({
              position: poi.location,
              icon: "/poi-marker-2.png",
              map: newMap,
            });

            newMap.setCenter(poi.location);
          });
        });

        onMapReady({
          createMarker1: () => {
            newMap.off("click", handleMarker2Click);
            newMap.on("click", handleMarker1Click);
          },
          createMarker2: () => {
            newMap.off("click", handleMarker1Click);
            newMap.on("click", handleMarker2Click);
          },
          stopListening: () => {
            newMap.off("click", handleMarker1Click);
            newMap.off("click", handleMarker2Click);
          },
          getCity: () => {
            let marker1Position = newMarker1.getPosition();
            let marker2Position = newMarker2.getPosition();
            console.log(marker1Position);
            driving.search(
              [marker1Position.lng, marker1Position.lat], // 起点
              [marker2Position.lng, marker2Position.lat], // 终点
              (status, result) => {
                if (status === "complete") {
                  const cities = new Set();
                  result.routes[0].steps.forEach((step) => {
                    step.cities?.forEach((city) => cities.add(city.name));
                  });
                  alert(`路线经过的城市: ${Array.from(cities).join(", ")}`);
                }
              }
            );
          },
        });

        setMapInstance(newMap);
      })
      .catch(console.error);

    return () => mapInstance?.destroy();
  }, []);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      <div className="w-52 h-16 bg-white z-10 absolute top-0 right-0 mt-1 mr-1 rounded-xl flex flex-col items-center justify-center space-y-2 border-1 border-gray-400">
        <input
          id="pickerInput1"
          placeholder="搜索地点..."
          className="border-gray-400 border-1 rounded-md w-3/4"
        />
        <input
          id="pickerInput2"
          placeholder="搜索地点..."
          className="border-gray-400 border-1 rounded-md w-3/4"
        />
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
