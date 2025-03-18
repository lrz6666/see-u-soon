import { useEffect, useRef, useState, useContext } from "react";
import { useMapContext } from "../../context/MapContext";

const MapComponent = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  const { AMap, isLoading, error } = useMapContext();

  useEffect(() => {
    if (!AMap || isLoading) return;

    const map = new AMap.Map(mapRef.current, {
      zoom: 13,
      center: [116.397428, 39.90923],
    });

    // 添加地图点击事件
    map.on("click", (e) => {
      // 清除旧标记
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // 创建新标记
      const newMarker = new AMap.Marker({
        position: [e.lnglat.getLng(), e.lnglat.getLat()],
        map: map,
      });

      // 更新标记引用
      markerRef.current = newMarker;

      // 将地图中心移动到点击位置
      map.setCenter([e.lnglat.getLng(), e.lnglat.getLat()]);
    });
    // 获取用户所在地
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([longitude, latitude]);
      map.setCenter([longitude, latitude]);

      // 添加用户位置标记
      new AMap.Marker({
        position: [longitude, latitude],
        map: map,
      });
    });
  }, [AMap, isLoading]);
  return <div ref={mapRef} className="w-full h-full" />;
};
export default MapComponent;
