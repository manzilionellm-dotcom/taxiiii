"use client";

import { useState } from "react";
import { ReadinessWidget } from "@/components/readiness-widget";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { appendChat } from "@/lib/progress/store";
import { ProtectedView } from "@/components/protected-view";
import { useQuestionCatalog } from "@/lib/questions/use-catalog";
import type { ChatTurn } from "@/lib/types";

export function ChatPanel() {
  const { state, setState } = useAppState();
  const dict = t(state.profile.locale);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const track = state.profile.activeTrack;
  const { catalog } = useQuestionCatalog(track);
  const readiness = computeReadiness(
    track,
    catalog,
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
    <ProtectedView locale={state.profile.locale}>
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
          <div className="px-2 py-8 text-center">
            <p className="font-serif text-lg text-black">{dict.chat}</p>
            <p className="mt-2 text-sm leading-6 text-[#6b6560]">{dict.chatEmpty}</p>
          </div>
        ) : (
          state.chat.map((turn, index) => (
            <div
              key={`${turn.at}-${index}`}
              className={`max-w-[92%] space-y-1 rounded-2xl px-3.5 py-2.5 ${
                turn.role === "user"
                  ? "ml-auto bg-[#1f3d2b] text-[#fffdf8]"
                  : "bg-[#f3eee4] text-black"
              }`}
            >
              <p
                className={`text-[10px] uppercase tracking-[0.12em] ${
                  turn.role === "user" ? "text-[#d7d0c3]" : "text-[#6b6560]"
                }`}
              >
                {turn.role === "user" ? "Du" : "IA"}
              </p>
              <p className="leading-6">{turn.content}</p>
              {turn.sources?.length ? (
                <p className={`text-xs ${turn.role === "user" ? "text-[#d7d0c3]" : "text-[#6b6560]"}`}>
                  {turn.sources.join(" · ")}
                </p>
              ) : null}
            </div>
          ))
        )}
        {pending ? (
          <div className="max-w-[60%] space-y-2 rounded-2xl bg-[#f3eee4] px-3.5 py-3">
            <div className="skeleton h-2.5 w-24" />
            <div className="skeleton h-2.5 w-40" />
          </div>
        ) : null}
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
          className="field flex-1"
        />
        <button type="submit" className="btn-primary shrink-0 px-5" disabled={pending}>
          {dict.send}
        </button>
      </form>
    </div>
    </ProtectedView>
  );
}
