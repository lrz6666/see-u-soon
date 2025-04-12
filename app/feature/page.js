"use client";
import Button from "../components/Button";
import Background from "../components/Background";
import MapComponent from "../components/mapComponent";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
export default function feature() {
  const tourismCities = [
    "北京市",
    "长春市",
    "长沙市",
    "成都市",
    "重庆市",
    "大连市",
    "福州市",
    "广州市",
    "贵阳市",
    "哈尔滨市",
    "海口市",
    "杭州市",
    "合肥市",
    "呼和浩特市",
    "黄山市",
    "济南市",
    "嘉兴市",
    "昆明市",
    "拉萨市",
    "兰州市",
    "乐山市",
    "丽江市",
    "林芝市",
    "洛阳市",
    "南京市",
    "南宁市",
    "宁波市",
    "青岛市",
    "秦皇岛市",
    "三亚市",
    "上海市",
    "沈阳市",
    "石家庄市",
    "苏州市",
    "太原市",
    "天津市",
    "乌鲁木齐市",
    "无锡市",
    "武汉市",
    "西安市",
    "西宁市",
    "厦门市",
    "银川市",
    "张家界市",
    "郑州市",
    "珠海市",
    "遵义市",
    "澳门特别行政区",
    "香港特别行政区",
    "开封市"
  ];
  const [mapFunctions, setMapFunctions] = useState(null);
  const [nearbyCities, setNearbyCities] = useState([]);
  const handleMapReady = ({
    /*createMarker1,*/ createMarker2,
    /*createMarker3,*/ deleteMarker,
    stopListening,
    queryCities,
  }) => {
    setMapFunctions({
      /*createMarker1,*/ createMarker2,
      /*createMarker3,*/ deleteMarker,
      stopListening,
      queryCities,
    });
  };
  const handleQueryCities = () => {
    const cities = mapFunctions.queryCities();
    const uniqueCities = [...new Set(cities)];
    setNearbyCities(uniqueCities); // 存储到状态
  };
  return (
    <div className="">
      <Background />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="h-1/4 w-screen items-center justify-center flex">
          {/* <p>Head</p> */}
        </div>
        <div className="h-1/2 flex-grow w-screen items-center justify-center flex flex-col gap-4">
          {/* 城市单 */}
          {nearbyCities.length > 0 && (
            <div className="w-5/6 text-black bg-[#f4fdfc] rounded-2xl mt-4 flex flex-col gap-5">
              <div className="flex flex-wrap mx-5  ">
                <h1 className="p-1 text-lg text-[#94d0c9] font-extrabold text-center">旅游城市:</h1>
                  {nearbyCities.map((city, index) => {
                    if (tourismCities.includes(city.name))
                      return (
                    <p key={index} className="p-1 text-lg font-bold  text-amber-400">{city.name}</p>
                      );
                      return null
                  })}
              </div>
              <div className="flex flex-wrap mx-5  ">
                <h1 className="p-1 text-lg text-[#94d0c9] font-extrabold text-center">普通城市:</h1>
                  {nearbyCities.map((city, index) => {
                    if (!tourismCities.includes(city.name))
                      return (
                    <p key={index} className="p-1 text-lg font-bold  text-zinc-700">{city.name}</p>
                      );
                      return null
                  })}
              </div>
            </div>
          )}
          {/* 地图组件 */}
          <div className="h-100 md:h-130  xl:h-140  w-5/6 ">
            <MapComponent
              className=""
              onMapReady={handleMapReady}
              onQueryCities={(cities) => setNearbyCities(cities)}
            />
          </div>
          {/* 按钮集 */}
          <div className="w-5/6 h-1/5 mx-auto grid grid-cols-2 justify-items-center sm:flex sm:flex-wrap sm:justify-center sm:items-center  ">
            <Button
              className="text-[#a1e4dc] h-fit mx-0.5 my-1 !bg-gray-50 font-bold !border-white"
              onClick={() => {
                mapFunctions.deleteMarker();
                setNearbyCities([]);
              }}
            >
              清除所有标记
            </Button>
            <Button
              className="text-[#a1e4dc] h-fit mx-0.5 my-1 !bg-gray-50 font-bold !border-white"
              onClick={() => {
                mapFunctions.queryCities();
                handleQueryCities();
              }}
            >
              查询沿线城市
            </Button>
            <Button
              className="text-[#a1e4dc] h-fit mx-0.5 my-1 !bg-gray-50 font-bold !border-white"
              onClick={() => {
                mapFunctions.createMarker2();
              }}
            >
              手动创建中间点
            </Button>
            <Button
              className="text-[#a1e4dc] h-fit mx-0.5 my-1 !bg-gray-50 font-bold !border-white"
              onClick={() => {
                mapFunctions.stopListening();
              }}
            >
              停止中间点创建
            </Button>
          </div>
        </div>
        <div className=" w-screen items-center flex">
        </div>
        <Link
            href="https://github.com/lrz6666/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 fixed left-0 bottom-0 z-100 text-gray-700 hover:text-black transition-colors"
          >
            <FaGithub size={24} />
            <span>lrz6666</span>
          </Link>
      </div>
    </div>
  );
}
