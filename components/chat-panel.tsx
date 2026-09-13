"use client";

import { useState } from "react";
import { ReadinessWidget } from "@/components/readiness-widget";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { appendChat } from "@/lib/progress/store";
import { questionsForTrack } from "@/lib/questions/bank";
import type { ChatTurn } from "@/lib/types";

export function ChatPanel() {
  const { state, setState } = useAppState();
  const dict = t(state.profile.locale);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const track = state.profile.activeTrack;
  const readiness = computeReadiness(
    track,
    questionsForTrack(track),
    state.attempts,
    state.exams,
  );

  async function send() {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    const user: ChatTurn = { role: "user", content: text, at: new Date().toISOString() };
    setState((prev) => appendChat(prev, [user]));
    setPending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: state.chat.slice(-8),
          locale: state.profile.locale,
        }),
      });
      const data = (await response.json()) as {
        answer: string;
        sources?: string[];
        grounded?: boolean;
      };
      const assistant: ChatTurn = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        grounded: data.grounded,
        at: new Date().toISOString(),
      };
      setState((prev) => appendChat(prev, [assistant]));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-black">{dict.chat}</h1>
        <p className="text-[#6b6560]">{dict.chatLead}</p>
        {readiness.ready ? (
          <p className="text-sm font-medium text-[#1f3d2b]">{dict.examReadyChat}</p>
        ) : null}
      </header>
      <ReadinessWidget locale={state.profile.locale} readiness={readiness} />
      <div className="card max-h-[28rem] space-y-3 overflow-y-auto">
        {state.chat.length === 0 ? (
          <p className="text-sm text-[#6b6560]">{dict.chatEmpty}</p>
        ) : (
          state.chat.map((turn, index) => (
            <div key={`${turn.at}-${index}`} className="space-y-1">
              <p className="text-xs uppercase tracking-[0.12em] text-[#6b6560]">
                {turn.role === "user" ? "Du" : "IA"}
              </p>
              <p className={turn.role === "user" ? "text-black" : "text-black"}>{turn.content}</p>
              {turn.sources?.length ? (
                <p className="text-xs text-[#6b6560]">{turn.sources.join(" · ")}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={dict.chatPlaceholder}
          className="flex-1 rounded-xl border border-[#ddd6c8] bg-white px-3 py-3 text-black"
        />
        <button type="submit" className="btn-primary" disabled={pending}>
          {dict.send}
        </button>
      </form>
    </div>
  );
}
