import { Metadata } from "next";

type Props = {
    params: Promise<{productid:string}>
}


export const generateMetadata = async ({params}:Props):Promise<Metadata>=>{
    const id = (await params).productid;
    const title = await new Promise ((resolve)=>{
        setTimeout(()=>{
            resolve(`iPhone ${id}`);
        }, 100);
    });
    return{
        title: `Product ${title}`,
    };
}

export default async function ProductDetails({params,}: Props){
    const prodId = (await params).productid;
    // console.log(prodId);
    return <div>
        <h1>Details of product {prodId}</h1>
    </div>;
}