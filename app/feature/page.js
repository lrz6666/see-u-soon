"use client";
import Button from "../components/Button";
import Background from "../components/Background";
import MapComponent from "../components/mapComponent";
import { useState } from "react";
export default function feature() {
  const [mapFunctions, setMapFunctions] = useState(null);
  const handleMapReady = ({ createMarker1, createMarker2, stopListening,getCity }) => {
    setMapFunctions({ createMarker1, createMarker2, stopListening,getCity});
  };
  return (
    <div className="h-screen">
      <Background />
      <div className="flex flex-col items-center justify-evenly h-screen">
        <div className="h-1/6 w-screen items-center justify-center flex">
          <p>Head</p>
        </div>
        <div className="h-2/3 w-screen items-center justify-center flex">
          <div className="h-2/3 w-5/6 border-amber-50 border-2 rounded-xl">
            <MapComponent onMapReady={handleMapReady} />
            <Button onClick={()=>{mapFunctions.createMarker1()}}>创建标记1</Button>
            <Button onClick={()=>{mapFunctions.createMarker2()}}>创建标记2</Button>
            <Button onClick={()=>{mapFunctions.stopListening()}}>取消创建</Button>
            <Button onClick={()=>{mapFunctions.getCity()}}>查询</Button>
          </div>
        </div>
        <div className="h-1/6 w-screen items-center justify-center flex">
          <p>footer</p>
        </div>
      </div>
    </div>
  );
}
