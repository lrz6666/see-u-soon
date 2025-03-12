import Image from "next/image";
import Button from "../components/Button";
export default function Home() {
  return (
    <div className="bg-amber-50 h-screen">
      frame
      <div className="bg-amber-600 flex flex-col items-center justify-center gap-6 py-8">
        <Image src="/微信图片_20250305203017.jpg" width={300} height={500} alt="Description" />
        <Button className=''>START</Button>
        <div className="h-1/3 w-1/3">
        <p className="font-sans  indent-10 text-lg leading-relaxed text-justify mb-6 break-words">这个项目旨在为身处异地的朋友和恋人们提供一个便捷的见面地点推荐工具。愿每一位使用者都能通过它缩短彼此的距离，早日与心中牵挂的人相聚。</p>
        </div>
      </div>
    </div>
  );
}
