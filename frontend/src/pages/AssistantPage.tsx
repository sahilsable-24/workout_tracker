import { useState, type SubmitEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { streamChatMessage, type ChatMessage } from "../api/ai";
import Header from "../components/Header";

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi — ask me about your workouts, progress, or general training questions.",
};

function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const nextMessages = [...messages, userMessage];

    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);
    setStreamError(false);

    try {
      await streamChatMessage(nextMessages, (chunk) => {
        setMessages((current) => {
          const updated = [...current];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + chunk,
          };
          return updated;
        });
      });
    } catch {
      setStreamError(true);
    } finally {
      setIsStreaming(false);
    }
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
                <div className="prose prose-invert prose-sm max-w-none overflow-x-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content || (isStreaming && i === messages.length - 1 ? "..." : "")}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          ))}

          {streamError && (
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
            disabled={isStreaming || !input.trim()}
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