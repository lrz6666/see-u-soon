import Image from "next/image";
import Button from "../components/Button";
export default function Home() {
  return (
    <div className="bg-amber-50">
      frame
      <div className="bg-amber-600">
        content
        <Image src="/微信图片_20250305203017.jpg" width={300} height={500} alt="Description" />
        <Button className='bg-amber-200'>123</Button>
        <p>11</p>
      </div>
    </div>
  );
}
