import { apiFetch } from "./client";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string
}

export interface ChatResponse {
    reply: string
}

export function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse>{
    return apiFetch<ChatResponse>("/ai/chat", {
        method:"POST",
        body: JSON.stringify({messages})
    })
}