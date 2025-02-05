import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";



export async function POST(request: NextRequest){
    const {text}  = await request.json();
    const model = new ChatGroq({
        model: "mixtral-8x7b-32768",
        temperature: 0
      });


    const prompt = ChatPromptTemplate.fromTemplate("Ask me anything about {topic}");
    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const res = await chain.invoke({ topic: text });

    return NextResponse.json({data: res});
}