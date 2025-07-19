export default async function handler(req, res) {
  try {
    const body = req.body;
    const userQuestion = body.question;

    // صيغة السؤال النهائية
    const prompt = `أجب باللغة العربية: ${userQuestion}`;

    // الاتصال بـ DuckDuckGo Instant Answer API
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(prompt)}&format=json&no_redirect=1&no_html=1`);
    const data = await response.json();

    const answer = data.Abstract || data.Answer || "لم يتم العثور على نتيجة دقيقة، يرجى المحاولة بصيغة مختلفة.";

    return res.status(200).json({ result: answer });
  } catch (error) {
    console.error('حدث خطأ في الخادم:', error);
    return res.status(500).json({ error: 'فشل في معالجة الطلب' });
  }
}

