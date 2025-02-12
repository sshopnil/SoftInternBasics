import { Scene } from "@/components/Scene";
import ButtonComponent from "@/components/ButtonComponent";
import MeshComponent from "@/components/MeshComponent";
import Link from "next/link";

export default function Home() {

  return (
      <button className="absolute top-5 left-5 bg-white p-2">
      <Link href={'/buy'}>
        GO TO BUY

      </Link>
      </button>
  );
}
