import { comments } from "../data";
export async function GET(request: Request, {params}: {params: Promise<{id: string}>}){
    const {id} = await params;

    const comment = comments.find((item)=> item.id == parseInt(id));

    return Response.json(comment);
}

export async function PATCH(request: Request, {
    params
}: {
    params: Promise<{id: string}>
}){
    const {id} = await params;
    const body = await request.json();

    const {text} = body;

    const index = comments.findIndex((it)=> it.id === parseInt(id));

    comments[index].text = text;

    return Response.json(comments[index]);
}

export async function DELETE(_request: Request, {
    params
}:{
    params: Promise<{id: string}>
}){
    const {id} = await params;

    const ind = comments.findIndex((it)=> it.id === parseInt(id));

    const deletedComment = comments[ind];

    comments.splice(ind, 1);

    return Response.json(deletedComment);
}