async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value.trim();
    const chatBox = document.getElementById("chat-box");

    if (message === "") return;

    // أضف رسالة المستخدم
    const userMessage = `<p><strong>You:</strong> ${message}</p>`;
    chatBox.innerHTML += userMessage;

    // عرض رسالة تحميل
    const loadingMessage = `<p><strong>Bot:</strong> Thinking...</p>`;
    chatBox.innerHTML += loadingMessage;

    // استدعاء API لتوليد الرد
    try {
        // استبدل YOUR_HUGGINGFACE_API_KEY بمفتاحك الشخصي من Hugging Face
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: {
                "Authorization": "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", // استبدل هنا
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: message }),
        });

        const data = await response.json();

        // إزالة رسالة التحميل
        chatBox.innerHTML = chatBox.innerHTML.replace(loadingMessage, "");

        // معالجة استجابة API
        if (data.error) {
            chatBox.innerHTML += `<p><strong>Bot:</strong> Sorry, I couldn't process that.</p>`;
        } else if (data[0] && data[0].generated_text) {
            // عرض الرد من البوت
            const botReply = `<p><strong>Bot:</strong> ${data[0].generated_text}</p>`;
            chatBox.innerHTML += botReply;
        } else {
            // إذا كانت الاستجابة غير متوقعة
            chatBox.innerHTML += `<p><strong>Bot:</strong> An error occurred. Please try again.</p>`;
        }
    } catch (error) {
        // في حال حدوث خطأ في الاتصال بـ API
        chatBox.innerHTML = chatBox.innerHTML.replace(loadingMessage, "");
        console.error("Error:", error);
        chatBox.innerHTML += `<p><strong>Bot:</strong> An error occurred while processing your request.</p>`;
    }

    inputField.value = ""; // تفريغ حقل الإدخال
}
