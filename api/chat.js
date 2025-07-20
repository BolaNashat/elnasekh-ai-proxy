export default async function handler(req, res) {
  const body = req.method === 'POST' ? await parseBody(req) : {};
  const question = body.question;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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` // ← ضع مفتاحك هنا
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "أجب باللغة العربية وباختصار وبأسلوب بسيط وواضح." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content ?? "لم يتم العثور على إجابة.";

    res.status(200).json({ result: answer });
  } catch (error) {
    res.status(500).json({ error: "فشل في الاتصال بـ OpenAI." });
  }
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } 
      catch (e) { reject(e); }
    });
  });
}
