'use client'
import Button from "../components/Button";
import Background from "../components/Background";
import MapComponent from "../components/mapComponent";
export default function feature() {
  
  return (
    <div className="h-screen">
      <Background />
      <div className="flex flex-col items-center justify-evenly h-screen">
        <div className="h-1/6 w-screen items-center justify-center flex">
          <p>Head</p>
        </div>
        <div className="h-2/3 w-screen items-center justify-center flex">
          <div className="h-2/3 w-5/6 border-amber-50 border-2 rounded-xl">
            <MapComponent/>
            <Button>1</Button>
            <Button>2</Button>
          </div>
        </div>
        <div className="h-1/6 w-screen items-center justify-center flex">
          <p>footer</p>
        </div>
      </div>
    </div>
  );
}
