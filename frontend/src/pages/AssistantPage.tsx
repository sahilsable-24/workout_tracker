import { useState, type SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage, type ChatMessage } from "../api/ai";
import Header from "../components/Header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi — ask me about your workouts, progress, or general training questions.",
};

function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");

  const mutation = useMutation({
    mutationFn: (nextMessages: ChatMessage[]) => sendChatMessage(nextMessages),
    onSuccess: (data, nextMessages) => {
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    },
  });

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const nextMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(nextMessages);
    setInput("");
    mutation.mutate(nextMessages);
  }

  return (
    <div className="min-h-screen bg-graphite text-chalk flex flex-col">
      <div className="max-w-2xl mx-auto w-full p-6 sm:p-10 flex flex-col flex-1">
        <Header />

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm ${
                m.role === "user"
                  ? "bg-brass text-graphite ml-auto"
                  : "bg-graphite-deep text-chalk"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              ) : (
                m.content 
              )}
            </div>
          ))}

          {mutation.isPending && (
            <div className="max-w-[80%] px-4 py-2.5 rounded-lg text-sm bg-graphite-deep text-steel">
              Thinking...
            </div>
          )}

          {mutation.isError && (
            <p className="text-brick text-sm">Something went wrong. Try again.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 bg-graphite-deep text-chalk border border-steel/50 focus:border-brass focus:outline-none transition-colors rounded-lg px-4 py-3"
          />
          <button
            type="submit"
            disabled={mutation.isPending || !input.trim()}
            className="bg-brass hover:bg-brass/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-graphite font-medium px-5 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssistantPage;