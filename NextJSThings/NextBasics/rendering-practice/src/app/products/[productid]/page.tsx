export const dynamicParams = false;

type Props = {
    params: Promise<{productid:string}>
}
export async function generateStaticParams(){
    return [{id: '1'},{ id: '2'}, {id: '3',}]
}

export default async function ProductDetails({params,}: Props){
    const prodId = (await params).productid;
    // console.log(prodId);
    return <div>
        <h1>Details of product {prodId} rendered at {new Date().toLocaleTimeString()}</h1>
    </div>;
}