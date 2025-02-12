import { Scene } from "@/components/Scene";
import ButtonComponent from "@/components/ButtonComponent";
import MeshComponent from "@/components/MeshComponent";
import { Suspense } from "react";
export default function Buy (){
    return(<Suspense>
    <MeshComponent/>
    <ButtonComponent/>
    </Suspense>);
}