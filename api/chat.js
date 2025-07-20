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
