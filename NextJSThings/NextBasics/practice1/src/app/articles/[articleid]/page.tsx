// import Link from "next/link";

// export default async function NewsArticle({params, searchParams}:
//     {
//         params: Promise<{articleid: string}>,
//         searchParams: Promise<{lang?:"en" | "es" | "fr"}>
//     }
// ){
//     const {articleid} = await params;
//     const {lang='en'} = await searchParams;

//     return (
//         <div>
//             <h1>News article id {articleid}</h1>
//             <p>Reading in language {lang}</p>

//             <div>
//                 <Link href={`/articles/${articleid}?lang=en`}>English</Link>
//                 <Link href={`/articles/${articleid}?lang=fr`}>French</Link>
//             </div>
//         </div>
//     )
// }

//=========above code is for server side==========

//=========below is for client side================

"use client";
import Link from "next/link";
import {use} from 'react';


export default function NewsArticle({params, searchParams}:
    {
        params: Promise<{articleid: string}>,
        searchParams: Promise<{lang?:"en" | "es" | "fr"}>
    }
){
    const {articleid} = use(params);
    const {lang='en'} = use(searchParams);

    return (
        <div>
            <h1>News article id {articleid}</h1>
            <p>Reading in language {lang}</p>

            <div>
                <Link href={`/articles/${articleid}?lang=en`}>English</Link>
                <Link href={`/articles/${articleid}?lang=fr`}>French</Link>
            </div>
        </div>
    )
}