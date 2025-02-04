import Link from "next/link";
import Product from "@/components/product";
import Review from "@/components/review";
import { Suspense } from "react";



export default function ProductListPage(){
    return (
        <div>
            <h1>This is a product page</h1>
            <ul>
                <li>
                    <Link href={'/products/1'}>Product 1</Link>
                </li>
                <li>
                    <Link href={'/products/2'}>Product 2</Link>
                </li>
                <li>
                    <Link href={'/products/3'}>Product 3</Link>
                </li>
            </ul>

            <br />
            <br />

            <Suspense fallback={'loading products....'}>
                <Product/>
            </Suspense>
            <Suspense fallback={'loading reviews....'}>
                <Review/>
            </Suspense>
        </div>
    )
}