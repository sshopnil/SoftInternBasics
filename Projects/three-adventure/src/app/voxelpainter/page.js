import VoxelPainter from "@/components/VoxelPainter";
import { Suspense } from "react";
export default function VoxelPainterComponent (){
    return(<Suspense>
    <VoxelPainter/>
    </Suspense>);
}