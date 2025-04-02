"use client";
import { useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import dynamic from "next/dynamic";
import * as turf from "@turf/turf";
import citiesData from "@/public/data/cities/cities.json";

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
  const [cityOptions, setCityOptions] = useState([]);
  // 输入框状态管理
  const [inputValues, setInputValues] = useState(["", "", ""]);
  const [filteredCities, setFilteredCities] = useState([[], [], []]);
  const [showDropdowns, setShowDropdowns] = useState([false, false, false]);
  const [highlightedIndices, setHighlightedIndices] = useState([-1, -1, -1]);

  // 提取所有城市名称
  useEffect(() => {
    const allCities = citiesData.data.flatMap((province) =>
      province.cities ? province.cities.map((city) => city.name) : []
    );
    setCityOptions(allCities);
  }, []);

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

  // 根据城市名称查找坐标并放置标记
  const handleCitySelect = (cityName, markerRef, setMarker) => {
    if (!cityName) return;

    // 在所有城市中查找匹配的城市
    const foundCity = citiesData.data
      .flatMap((province) => province.cities || [])
      .find((city) => city.name === cityName);

    if (foundCity && mapInstance) {
      if (markerRef.current) markerRef.current.setMap(null);
      const position = new AMap.LngLat(
        foundCity.center[0],
        foundCity.center[1]
      );
      markerRef.current = new AMap.Marker({
        position,
        icon: `/poi-marker-${
          markerRef === marker1Ref ? "1" : markerRef === marker2Ref ? "2" : "3"
        }.png`,
        offset: new AMap.Pixel(-25, -60),
        map: mapInstance,
      });
      mapInstance.setCenter(position);
      setMarker(markerRef.current);
    }
  };

  // 处理输入变化
  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    const newFilteredCities = [...filteredCities];
    newFilteredCities[index] = cityOptions.filter((city) =>
      city.includes(value)
    );
    setFilteredCities(newFilteredCities);

    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = true;
    setShowDropdowns(newShowDropdowns);
  };

  // 处理城市选择
  const handleCityChoice = (index, city) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = city;
    setInputValues(newInputValues);

    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = false;
    setShowDropdowns(newShowDropdowns);

    const markerRef =
      index === 0 ? marker1Ref : index === 1 ? marker2Ref : marker3Ref;
    const setMarker =
      index === 0 ? setMarker1 : index === 1 ? setMarker2 : setMarker3;
    handleCitySelect(city, markerRef, setMarker);
  };

  // 处理键盘导航
  const handleKeyDown = (index, e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newHighlightedIndices = [...highlightedIndices];
      newHighlightedIndices[index] = Math.min(
        newHighlightedIndices[index] + 1,
        filteredCities[index].length - 1
      );
      setHighlightedIndices(newHighlightedIndices);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newHighlightedIndices = [...highlightedIndices];
      newHighlightedIndices[index] = Math.max(
        newHighlightedIndices[index] - 1,
        -1
      );
      setHighlightedIndices(newHighlightedIndices);
    } else if (e.key === "Enter" && highlightedIndices[index] >= 0) {
      e.preventDefault();
      handleCityChoice(index, filteredCities[index][highlightedIndices[index]]);
    }
  };

  // 处理失去焦点
  const handleBlur = (index) => {
    setTimeout(() => {
      const newShowDropdowns = [...showDropdowns];
      newShowDropdowns[index] = false;
      setShowDropdowns(newShowDropdowns);
    }, 200);
  };

  useEffect(() => {
    if (!mapInstance) return;

    // 创建标记点击处理函数的工厂函数
    const createMarkerClickHandler =
      (markerRef, setMarker, markerNumber) => (ev) => {
        const lnglat = ev.lnglat;

        // 清除旧标记
        if (markerRef.current) markerRef.current.setMap(null);

        // 创建新标记
        markerRef.current = new AMap.Marker({
          position: [lnglat.getLng(), lnglat.getLat()],
          icon: `/poi-marker-${markerNumber}.png`,
          offset: new AMap.Pixel(-25, -60),
          map: mapInstance,
        });

        // 更新状态
        setMarker(markerRef.current);
      };

    // 使用工厂函数生成三个处理函数
    const handleMarker1Click = createMarkerClickHandler(
      marker1Ref,
      setMarker1,
      1
    );
    const handleMarker2Click = createMarkerClickHandler(
      marker2Ref,
      setMarker2,
      2
    );
    const handleMarker3Click = createMarkerClickHandler(
      marker3Ref,
      setMarker3,
      3
    );

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
        // 获取两条折线的路径
        const line1Path = polyline1Ref.current?.getPath() || [];
        const line2Path = polyline2Ref.current?.getPath() || [];
      
        // 准备用于计算的线段数组
        const lines = [];
        
        // 如果第一条折线有有效路径点，则创建线段
        if (line1Path.length >= 2) {
          lines.push(turf.lineString(line1Path.map(p => [p.lng, p.lat])));
        }
      
        // 如果第二条折线有有效路径点，则创建线段
        if (line2Path.length >= 2) {
          lines.push(turf.lineString(line2Path.map(p => [p.lng, p.lat])));
        }
      
        // 如果没有有效折线，直接返回空数组
        if (lines.length === 0) return [];
      
        const allCities = citiesData.data.flatMap(
          (province) => province.cities || []
        );
      
        const nearbyCities = allCities.filter((city) => {
          const cityPoint = turf.point(city.center);
          
          // 检查城市是否靠近任何一条折线
          return lines.some(line => {
            const distance = turf.pointToLineDistance(cityPoint, line, {
              units: "kilometers"
            });
            return distance <= 50;
          });
        });
      
        console.log(nearbyCities);
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
        plugins: [],
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
      <div className="w-52 h-1/3 bg-white z-10 absolute top-0 right-0 mt-1 mr-1 rounded-xl flex flex-col items-center justify-center space-y-2 border-1 border-gray-400">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative w-3/4">
            <input
              type="text"
              value={inputValues[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onFocus={() => {
                const newShowDropdowns = [...showDropdowns];
                newShowDropdowns[index] = true;
                setShowDropdowns(newShowDropdowns);
              }}
              onBlur={() => handleBlur(index)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder="输入城市名称..."
              className="border-gray-400 border-1 rounded-md w-full text-black px-2 py-1"
            />
            {showDropdowns[index] && filteredCities[index].length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCities[index].map((city, cityIndex) => (
                  <li
                    key={cityIndex}
                    className={`px-2 py-1 text-black cursor-pointer  ${
                      highlightedIndices[index] === cityIndex
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => handleCityChoice(index, city)}
                    onMouseEnter={() => {
                      const newHighlightedIndices = [...highlightedIndices];
                      newHighlightedIndices[index] = cityIndex;
                      setHighlightedIndices(newHighlightedIndices);
                    }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
