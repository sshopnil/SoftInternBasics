export default async function Review(){
    await new Promise((resolve)=> setTimeout(resolve, 5000));
    return <h1>Review Section</h1>
}