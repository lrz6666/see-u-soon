import Image from "next/image";
import Button from "../components/Button";
import Background from "../components/Background";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
export default function Home() {
  return (
    <div className=" h-screen">
      <Background />
      <div className=" flex flex-col items-center justify-evenly  py-8 h-screen ">
        <div className="flex flex-col flex-end items-center justify-center ">
          <Image
            src="/微信图片_20250305203017.jpg"
            width={150}
            height={250}
            alt="Description"
            className="rounded-[60px]"
          />
          <Link
            href="https://github.com/lrz6666"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <FaGithub size={24} />
            <span>lrz6666</span>
          </Link>
        </div>

        <Link href="/feature" passHref legacyBehavior>
          <Button
            as="a"
            className="hover:bg-teal-200 text-zinc-800 hover:text-teal-950 font-bold"
          >
            START
          </Button>
        </Link>
        <div className="mx-10 items-center justify-center flex">
          <p className="font-sans indent-10 text-xs sm:text-sm md:text-lg leading-relaxed font-bold text-justify mb-6 break-words text-black">
            这个工具旨在为身处异地的朋友和恋人们提供一个对双方来说都便捷的见面地点。
          </p>
        </div>
      </div>
    </div>
  );
}
