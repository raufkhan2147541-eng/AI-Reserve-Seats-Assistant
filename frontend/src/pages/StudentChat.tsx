import { useState } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const API_URL = "https://ai-reserve-seats-assistant.onrender.com";

const StudentChat = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Assalam-o-Alaikum! 👋 I am the Directorate Reserve Seats AI Student Assistant. You can ask me about eligibility, reserved seats, required documents, admission procedures and other official information.",
    },
  ]);

  // ==========================================
  // Format AI Response
  // ==========================================

  const formatAIResponse = (content: string) => {
    const lines = content.split("\n");

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Empty line
      if (!trimmedLine) {
        return <div key={index} className="h-3" />;
      }

      // ========================================
      // Markdown Headings
      // ========================================

      if (/^#{1,6}\s+/.test(trimmedLine)) {
        const heading = trimmedLine.replace(/^#{1,6}\s+/, "");

        return (
          <div
            key={index}
            className="mb-2 mt-4 text-base font-bold text-slate-900 first:mt-0"
          >
            {formatBoldText(heading)}
          </div>
        );
      }

      // ========================================
      // Numbered List
      // ========================================

      if (/^\d+\.\s+/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+)\.\s+(.*)$/);

        if (match) {
          return (
            <div
              key={index}
              className="mb-2 flex gap-3 pl-1 text-sm leading-7"
            >
              <span className="font-semibold text-blue-600">
                {match[1]}.
              </span>

              <span className="flex-1">
                {formatBoldText(match[2])}
              </span>
            </div>
          );
        }
      }

      // ========================================
      // Bullet List
      // ========================================

      if (/^[-*•]\s+/.test(trimmedLine)) {
        const bullet = trimmedLine.replace(/^[-*•]\s+/, "");

        return (
          <div
            key={index}
            className="mb-2 flex gap-3 pl-1 text-sm leading-7"
          >
            <span className="mt-1 text-blue-600">•</span>

            <span className="flex-1">
              {formatBoldText(bullet)}
            </span>
          </div>
        );
      }

      // ========================================
      // Normal Paragraph
      // ========================================

      return (
        <p
          key={index}
          className="mb-2 text-sm leading-7 text-slate-700"
        >
          {formatBoldText(trimmedLine)}
        </p>
      );
    });
  };

  // ==========================================
  // Convert **bold text** to Bold
  // ==========================================

  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (
        part.startsWith("**") &&
        part.endsWith("**")
      ) {
        return (
          <strong
            key={index}
            className="font-semibold text-slate-900"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  // ==========================================
  // Ask Question
  // ==========================================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const question = message.trim();

    if (!question || loading) {
      return;
    }

    // ========================================
    // Get Student Access Token
    // ========================================

    const accessToken =
      localStorage.getItem("access_token");

    if (!accessToken) {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now(),
          role: "assistant",
          content:
            "Authentication token not found. Please login again.",
        },
      ]);

      return;
    }

    // ========================================
    // Add User Message
    // ========================================

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      // ======================================
      // Send Question To Backend
      // ======================================

      const response = await fetch(
        `${API_URL}/qa/ask`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },

          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const data = await response.json();

      console.log("AI response:", data);

      // ======================================
      // Handle Authentication Error
      // ======================================

      if (response.status === 401) {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem("student");

        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: Date.now(),
            role: "assistant",
            content:
              "Your login session has expired. Please login again.",
          },
        ]);

        return;
      }

      // ======================================
      // Handle Other Errors
      // ======================================

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to get AI response."
        );
      }

      // ======================================
      // Get AI Answer
      // ======================================

      const answer =
        data.answer ||
        "I could not generate an answer.";

      // ======================================
      // Add AI Response
      // ======================================

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: answer,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "Question error:",
        error
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong while contacting the AI assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Suggested Question
  // ==========================================

  const selectQuestion = (
    question: string
  ) => {
    setMessage(question);
  };

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem("student");

    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      {/* ======================================
          Header
      ====================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          {/* Brand */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
              🤖
            </div>

            <div>

              <h1 className="font-bold text-slate-900">
                AI Student Assistant
              </h1>

              <p className="text-xs text-slate-500">
                Directorate Reserve Seats of
                Balochistan
              </p>

            </div>

          </div>

          {/* Dashboard + Logout */}

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "/student/dashboard")
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* ======================================
          Chat Area
      ====================================== */}

      <main className="flex-1 overflow-y-auto">

        <div className="mx-auto w-full max-w-4xl px-6 py-8">

          <div className="space-y-6">

            {messages.map(
              (chatMessage) => (

                <div
                  key={chatMessage.id}
                  className={`flex ${
                    chatMessage.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-2xl rounded-2xl px-5 py-4 ${
                      chatMessage.role === "user"
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-700 shadow-sm"
                    }`}
                  >

                    {/* AI Header */}

                    {chatMessage.role ===
                      "assistant" && (

                      <div className="mb-3 flex items-center gap-2">

                        <span className="text-sm">
                          🤖
                        </span>

                        <span className="text-xs font-semibold text-blue-600">
                          AI Assistant
                        </span>

                      </div>
                    )}

                    {/* Message */}

                    {chatMessage.role ===
                    "assistant" ? (
                      <div>
                        {formatAIResponse(
                          chatMessage.content
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-7">
                        {chatMessage.content}
                      </p>
                    )}

                  </div>

                </div>
              )
            )}

            {/* =================================
                Loading
            ================================= */}

            {loading && (

              <div className="flex justify-start">

                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

                  <div className="flex items-center gap-2">

                    <span>
                      🤖
                    </span>

                    <span className="text-sm text-slate-500">
                      AI is thinking...
                    </span>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* ======================================
          Suggested Questions + Input
      ====================================== */}

      <section className="border-t border-slate-200 bg-white">

        <div className="mx-auto w-full max-w-4xl px-6 pt-4">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Suggested Questions
          </p>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                selectQuestion(
                  "What are the eligibility requirements?"
                )
              }
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              What are the eligibility
              requirements?
            </button>

            <button
              type="button"
              onClick={() =>
                selectQuestion(
                  "Which documents are required?"
                )
              }
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              Which documents are
              required?
            </button>

            <button
              type="button"
              onClick={() =>
                selectQuestion(
                  "How can I apply for a reserved seat?"
                )
              }
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              How can I apply?
            </button>

          </div>

        </div>

        {/* ====================================
            Input
        ==================================== */}

        <div className="mx-auto w-full max-w-4xl px-6 py-4">

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
          >

            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              placeholder="Ask a question about reserved seats..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={
                !message.trim() ||
                loading
              }
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send"}
            </button>

          </form>

          <p className="mt-2 text-center text-xs text-slate-400">
            AI-generated responses should be
            verified against official
            Directorate information.
          </p>

        </div>

      </section>

    </div>
  );
};

export default StudentChat;