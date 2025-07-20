export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'الطريقة غير مسموحة' });
    }

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'السؤال غير موجود' });
    }

    const prompt = `أجب باللغة العربية: ${question}`;

    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(prompt)}&format=json&no_redirect=1&no_html=1`);
    const data = await response.json();

    const answer = data.Abstract || data.Answer || "لم يتم العثور على نتيجة دقيقة، يرجى المحاولة بصيغة مختلفة.";

    return res.status(200).json({ result: answer });
  } catch (error) {
    console.error('حدث خطأ في الخادم:', error);
    return res.status(500).json({ error: 'فشل في معالجة الطلب' });
  }
}
