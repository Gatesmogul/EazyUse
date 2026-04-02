import axios from "axios";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_KEY = process.env.OPENAI_API_KEY; // use dotenv

export async function queryOpenAI(messages: any[]) {
  const response = await axios.post(
    OPENAI_ENDPOINT,
    {
      model: "gpt-4o-mini",
      messages,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
    }
  );

  return response.data.choices[0].message;
}
