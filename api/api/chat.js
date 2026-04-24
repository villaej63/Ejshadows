let memory = [];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message } = req.body;

  memory.push({ role: "user", content: message });
  memory = memory.slice(-10);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a smart helpful assistant." },
        ...memory
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Error";

  memory.push({ role: "assistant", content: reply });

  return res.status(200).json({ reply });
}