"use client";

import { usePathname } from "next/navigation";

export default function NotFound(){
    const pathname = usePathname();

    const productId = pathname.split('/')[2];
    const reviewId = pathname.split('/')[4];
    return (
        <div>
        <h1>Not Found Review for product id {productId} and Review id {reviewId}</h1>
        </div>
    );
}

//params are not allowed in not found function
//so we should use usePathname and make it client side