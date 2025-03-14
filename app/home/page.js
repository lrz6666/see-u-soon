import Image from "next/image";
import Button from "../components/Button";
import Background from "../components/Background";
export default function Home() {
  return (
    <div className=" h-screen">
      <Background />
      <div className=" flex flex-col items-center justify-evenly  py-8 h-screen ">
        <Image
          src="/微信图片_20250305203017.jpg"
          width={150}
          height={250}
          alt="Description"
          className="rounded-[60px]"
        />
        <Button className=" hover:bg-teal-200 hover:text-teal-950 font-bold">
          START
        </Button>
        <div className="mx-10 items-center justify-center flex">
          <p className="font-sans indent-10 text-xs sm:text-sm md:text-lg leading-relaxed text-justify mb-6 break-words">
            这个工具旨在为身处异地的朋友和恋人们提供一个对双方来说都便捷的见面地点。
          </p>
        </div>
      </div>
    </div>
  );
}
