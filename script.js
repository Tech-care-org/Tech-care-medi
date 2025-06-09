
const PROXY_URL = "http://4.227.84.46:3001/generate"; // Final working proxy endpoint

async function sendPrompt() {
  const promptInput = document.getElementById("prompt");
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  appendMessage(prompt, "user");
  promptInput.value = "";

  appendMessage("⏳ Thinking...", "bot");

  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "medi",
        prompt: prompt,
        stream: false
      })
    });

    const result = await response.json();

    // Remove "Thinking..." placeholder
    const chatBox = document.getElementById("chat-box");
    chatBox.lastChild.remove();

    if (result && result.response) {
      appendMessage(result.response, "bot");
    } else {
      appendMessage("⚠️ Unexpected response from backend.", "bot");
    }
  } catch (error) {
    console.error(error);
    const chatBox = document.getElementById("chat-box");
    chatBox.lastChild.remove(); // Remove placeholder
    appendMessage("❌ Error: Unable to reach the backend.", "bot");
  }
}

function appendMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKey(event) {
  if (event.key === "Enter") {
    sendPrompt();
  }
}
