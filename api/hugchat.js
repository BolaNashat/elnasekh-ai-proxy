export default async function handler(req, res) {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'يرجى استخدام POST فقط.' });
  }

  try {
    const body = await parseBody(req);
    const userInput = body.question;

    const response = await fetch(
      "https://"https://hf.space/embed/BolaNash/deepseek-ai-DeepSeek/api/predict/",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: userInput,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    // ✅ Debug – سيساعدنا في معرفة الرد الحقيقي من Hugging Face
    console.log("DEBUG HuggingFace Response:", data);

    const answer =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : data.error?.message || "لم يتم الحصول على إجابة.";

    return res.status(200).json({ result: answer });
  } catch (error) {
    console.error("HuggingFace Error:", error);
    return res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بـ HuggingFace' });
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
