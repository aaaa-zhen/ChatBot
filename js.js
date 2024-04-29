

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

    if (userInput.toLowerCase().includes("记录笔记到notes")) {
        localStorage.setItem('noteContent', userInput);
        var botMessageElement = document.createElement("div");
        botMessageElement.classList.add("message", "bot-message");
        botMessageElement.innerHTML = '<p>Note saved!</p>';
        chatMessages.appendChild(botMessageElement);
    } else {
        fetch('https://api.aihubmix.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-3h4UkodL951Aif2EC9A485C91eBe4bE4B04d599fA355D5F8'
            },
            body: JSON.stringify({
                "model": "gpt-4",
                "messages": conversationHistory // 传递对话历史作为上下文
            })
        })
        .then(response => response.json())
        .then(data => {
            var botMessageElement = document.createElement("div");
            botMessageElement.classList.add("message", "bot-message");
        
            // 检查响应中是否包含关键词 code
            if (data.choices[0].message.content.toLowerCase().includes("code")) {
                botMessageElement.innerHTML = '<p style="color: red">' + data.choices[0].message.content + '</p>'; // 如果包含 code，将文本颜色设为红色
            } else {
                botMessageElement.innerHTML = '<p>' + data.choices[0].message.content + '</p>';
            }
        
            chatMessages.appendChild(botMessageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        
            // 添加 API 响应到对话历史
            conversationHistory.push({"role": "assistant", "content": data.choices[0].message.content});
        })
        
        .catch(error => console.error('Error:', error));
    }

    document.getElementById("user-input").value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
