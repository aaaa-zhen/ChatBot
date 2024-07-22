var conversationHistory = [
    {
        "role": "system",
        "content": "You are a helpful assistant."
    }
];

function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    // 添加用户输入到对话历史
    conversationHistory.push({"role": "user", "content": userInput});

    var chatMessages = document.getElementById("chat-messages");
    var userMessageElement = document.createElement("div");
    userMessageElement.classList.add("message", "user-message");
    userMessageElement.innerHTML = '<p>' + userInput + '</p>';

    chatMessages.appendChild(userMessageElement);

    fetch('https://api.aihubmix.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-3h4UkodL951Aif2EC9A485C91eBe4bE4B04d599fA355D5F8'
        },
        body: JSON.stringify({
            "model": "gpt-4o-mini",
            "messages": conversationHistory // 传递对话历史作为上下文
        })
    })
    .then(response => response.json())
    .then(data => {
        var botMessageElement = document.createElement("div");
        botMessageElement.classList.add("message", "bot-message");
    
        // 将 API 返回的文本分割成段落
        var paragraphs = data.choices[0].message.content.split("\n\n");
    
        // 创建一个容器元素，用于放置所有段落
        var contentContainer = document.createElement("div");
    
        // 添加每个段落到内容容器中，并应用动画类
        paragraphs.forEach(paragraphText => {
            var paragraphElement = document.createElement("p");
            paragraphElement.textContent = paragraphText;
            paragraphElement.classList.add("fade-in"); // 添加动画类
            contentContainer.appendChild(paragraphElement);
        });
    
        // 添加样式以调整行间距
        contentContainer.style.marginBottom = "20px"; // 调整内容容器的底部间距
    
        // 将内容容器添加到消息元素中
        botMessageElement.appendChild(contentContainer);
    
        chatMessages.appendChild(botMessageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    
        // 添加 API 响应到对话历史
        conversationHistory.push({"role": "assistant", "content": data.choices[0].message.content});
    })
    .catch(error => console.error('Error:', error));

    document.getElementById("user-input").value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
