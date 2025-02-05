import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";



export default async function ChatOPENAI() {
    const model = new ChatGroq({
        model: "mixtral-8x7b-32768",
        temperature: 0
      });

      const prompt = ChatPromptTemplate.fromTemplate("tell me a joke about {topic}");

      const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const res = await chain.invoke({ topic: "bears" });

    console.log(res);


    return (
        <div>
            <h1>Hello</h1>
        </div>
    )

}