export default async function handler(req, res) {
  // نحصل على المفتاح من متغير البيئة
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  // التأكد أن الطلب من نوع POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموحة. استخدم POST فقط.' });
  }

  try {
    const body = await parseBody(req);
    const userQuestion = body.question;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "أجب باللغة العربية فقط، وبأسلوب واضح ومختصر."
          },
          {
            role: "user",
            content: userQuestion
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const answer = data.choices?.[0]?.message?.content ?? "لم يتم العثور على إجابة.";

    return res.status(200).json({ result: answer });
  } catch (error) {
    return res.status(500).json({ error: 'فشل في الاتصال بـ OpenAI.' });
  }
}

// وظيفة مساعدة لقراءة جسم الطلب
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}
