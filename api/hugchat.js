export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'يرجى استخدام POST فقط.' });
  }

  try {
    const body = await parseBody(req);
    const userInput = body.question;

    const response = await fetch("https://bola-nash-deepseek-ai-deepseek.hf.space/run/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [userInput]
      })
    });

    const data = await response.json();

    // ✅ هذا يعتمد على ما يرجعه الـ Space الخاص بك
    const answer = data?.data?.[0] || "لم يتم الحصول على إجابة من الـ Space.";

    return res.status(200).json({ result: answer });
  } catch (error) {
    console.error("HuggingFace Space Error:", error);
    return res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بـ Hugging Face Space' });
  }
}

// دالة قراءة جسم الطلب
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}
