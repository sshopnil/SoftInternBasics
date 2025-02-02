export default async function ProductDetails({params,}: {params: Promise<{productid: string}>;}){
    const prodId = (await params).productid;
    // console.log(prodId);
    return <div>
        <h1>Details of product {prodId}</h1>
    </div>;
}