export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const BASE_URL = "http://127.0.0.1:8000";

export async function streamChatMessage(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/ai/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to get a response from the assistant.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunkText = decoder.decode(value, { stream: true });
    onChunk(chunkText);
  }
}