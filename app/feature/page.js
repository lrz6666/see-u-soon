import Background from "../components/Background";
export default function feature() {
    
  return (
    <div className="h-screen">
      <Background />
      <div className="flex flex-col items-center justify-evenly h-screen">
        <div className="h-1/6 items-center justify-center"><p>Head</p></div>
        <div className="h-2/3 items-center justify-center"><p>Content</p></div>
        <div className="h-1/6 items-center justify-center"><p>footer</p></div>
      </div>
    </div>
  );
}
