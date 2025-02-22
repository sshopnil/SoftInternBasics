import { notFound } from "next/navigation";


export default async function ReviewDetails({
    params
}:{
    params: Promise <{productid: string, reviewid: string}>
}){
    const {productid, reviewid} = (await params);

    if(parseInt(reviewid) > 1000){
        notFound();
    }
    else if(parseInt(reviewid) === 1){
        throw new Error('Error in loading');
    }
    return <div>
        <h1>Reivew id {reviewid} for product {productid}</h1>
    </div>;
}