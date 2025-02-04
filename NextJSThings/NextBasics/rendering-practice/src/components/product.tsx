export default async function Product(){
    await new Promise((resolve)=> setTimeout(resolve, 5000));
    return <h1>Product Section</h1>
}