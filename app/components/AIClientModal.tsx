"use client";

import React, { useState } from "react";
import { X, Search } from "lucide-react";

const AI_CLIENTS = [
  { id: "claude", name: "Claude", color: "#D97757", icon: "✳️" },
  { id: "chatgpt", name: "ChatGPT", color: "#10A37F", icon: "🟢" },
  { id: "cursor", name: "Cursor", color: "#000000", icon: "▶" },
  { id: "windsurf", name: "Windsurf", color: "#4F6AF5", icon: "〰" },
  { id: "copilot", name: "Copilot", color: "#2563EB", icon: "😊" },
  { id: "gemini", name: "Gemini", color: "#8B5CF6", icon: "✦" },
  { id: "perplexity", name: "Perplexity", color: "#20B2AA", icon: "⬡" },
  { id: "openrouter", name: "OpenRouter", color: "#6366F1", icon: "⊕" },
  { id: "anthropic", name: "Anthropic API", color: "#D97757", icon: "✳️" },
  { id: "openai", name: "OpenAI API", color: "#10A37F", icon: "🟢" },
  { id: "geminicli", name: "Gemini CLI", color: "#8B5CF6", icon: "✦" },
  { id: "mistral", name: "Mistral AI", color: "#F97316", icon: "⬚" },
  { id: "manus", name: "Manus", color: "#3B82F6", icon: "Ⓜ" },
  { id: "vscode", name: "VS Code", color: "#0078D4", icon: "◈" },
  { id: "warp", name: "Warp", color: "#0EA5E9", icon: "❯" },
  { id: "zed", name: "Zed", color: "#3B82F6", icon: "Ⓩ" },
  { id: "python", name: "Python", color: "#F7C948", icon: "🐍" },
  { id: "typescript", name: "TypeScript", color: "#3178C6", icon: "TS" },
  { id: "julius", name: "Julius AI", color: "#EF4444", icon: "⏱" },
  { id: "vapi", name: "Vapi", color: "#7C3AED", icon: "Ⓥ" },
  { id: "toolhouse", name: "Toolhouse", color: "#059669", icon: "⚙" },
];

function ClientIconBadge({ client }: { client: typeof AI_CLIENTS[0] }) {
  const iconMap: Record<string, React.ReactElement> = {
    claude: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#D97757" />
        <path d="M12 6l-4 2.5v5L12 16l4-2.5v-5L12 6z" fill="#F5A98A" />
      </svg>
    ),
    chatgpt: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#10A37F" />
        <path d="M12 5.5C8.5 5.5 6 8 6 11.5c0 1.5.5 2.8 1.3 3.8L6 18.5h3.5l.7-1.2c.6.2 1.2.2 1.8.2 3.5 0 6-2.5 6-6S15.5 5.5 12 5.5z" fill="white" />
      </svg>
    ),
    cursor: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#000" />
        <polygon points="8,6 18,12 8,18" fill="white" />
      </svg>
    ),
    windsurf: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#EEF2FF" />
        <path d="M6 17 Q10 6 18 8" stroke="#4F6AF5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M6 17 Q14 14 18 8" stroke="#4F6AF5" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      </svg>
    ),
    copilot: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#EFF6FF" />
        <circle cx="9" cy="11" r="3.5" fill="#2563EB" />
        <circle cx="15" cy="11" r="3.5" fill="#2563EB" />
        <path d="M7 15 Q12 19 17 15" stroke="#2563EB" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    gemini: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#F5F3FF" />
        <path d="M12 4 L14 10 L20 12 L14 14 L12 20 L10 14 L4 12 L10 10 Z" fill="#8B5CF6" />
      </svg>
    ),
    perplexity: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#ECFDF5" />
        <path d="M12 4 L19 8 L19 16 L12 20 L5 16 L5 8 Z" stroke="#20B2AA" strokeWidth="1.5" fill="none" />
        <line x1="12" y1="4" x2="12" y2="20" stroke="#20B2AA" strokeWidth="1.5" />
      </svg>
    ),
    openrouter: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#EEF2FF" />
        <circle cx="12" cy="12" r="5" stroke="#6366F1" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="2" fill="#6366F1" />
        <line x1="12" y1="4" x2="12" y2="7" stroke="#6366F1" strokeWidth="1.5" />
        <line x1="12" y1="17" x2="12" y2="20" stroke="#6366F1" strokeWidth="1.5" />
        <line x1="4" y1="12" x2="7" y2="12" stroke="#6366F1" strokeWidth="1.5" />
        <line x1="17" y1="12" x2="20" y2="12" stroke="#6366F1" strokeWidth="1.5" />
      </svg>
    ),
    anthropic: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#FFF7ED" />
        <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#D97757" opacity="0.8" />
      </svg>
    ),
    openai: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#ECFDF5" />
        <path d="M12 5.5C8.5 5.5 6 8 6 11.5c0 1.5.5 2.8 1.3 3.8L6 18.5h3.5l.7-1.2c.6.2 1.2.2 1.8.2 3.5 0 6-2.5 6-6S15.5 5.5 12 5.5z" fill="#10A37F" />
      </svg>
    ),
    geminicli: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#F5F3FF" />
        <path d="M12 4 L14 10 L20 12 L14 14 L12 20 L10 14 L4 12 L10 10 Z" fill="#8B5CF6" opacity="0.8" />
        <text x="14" y="20" fontSize="6" fill="#8B5CF6" fontWeight="bold">CLI</text>
      </svg>
    ),
    mistral: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#FFF7ED" />
        <rect x="5" y="8" width="4" height="8" fill="#F97316" />
        <rect x="10" y="5" width="4" height="14" fill="#F97316" />
        <rect x="15" y="8" width="4" height="8" fill="#F97316" />
      </svg>
    ),
    manus: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#EFF6FF" />
        <text x="6" y="17" fontSize="13" fontWeight="bold" fill="#3B82F6">M</text>
      </svg>
    ),
    vscode: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#EFF6FF" />
        <path d="M17 4L10 11 6 8 4 9.5l4 3.5-4 3.5L6 18l4-3 7 7V4z" fill="#0078D4" />
      </svg>
    ),
    warp: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#F0F9FF" />
        <path d="M7 12 L12 7 L17 12" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M7 16 L12 11 L17 16" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      </svg>
    ),
    zed: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#EFF6FF" />
        <text x="5" y="17" fontSize="12" fontWeight="bold" fill="#3B82F6">Z</text>
      </svg>
    ),
    python: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#FEFCE8" />
        <path d="M12 4c-3 0-5 1-5 3v3h5v1H7c-2 0-3 1.5-3 4s1 4 3 4h1v-3c0-2 1.5-3 4-3s4 1 4 3v3h1c2 0 3-1.5 3-4s-1-4-3-4h-5v-1h5V7c0-2-2-3-5-3z" fill="#F7C948" />
        <circle cx="10" cy="7" r="1" fill="white" />
        <circle cx="14" cy="17" r="1" fill="white" />
      </svg>
    ),
    typescript: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#3178C6" />
        <text x="5" y="17" fontSize="8" fontWeight="bold" fill="white">TS</text>
      </svg>
    ),
    julius: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#FEF2F2" />
        <circle cx="12" cy="12" r="6" stroke="#EF4444" strokeWidth="1.5" fill="none" />
        <line x1="12" y1="8" x2="12" y2="12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="12" x2="15" y2="14" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    vapi: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#F5F3FF" />
        <text x="6" y="17" fontSize="13" fontWeight="bold" fill="#7C3AED">V</text>
      </svg>
    ),
    toolhouse: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <rect width="24" height="24" rx="6" fill="#ECFDF5" />
        <text x="5" y="17" fontSize="11" fontWeight="bold" fill="#059669">Tz</text>
      </svg>
    ),
  };

  return iconMap[client.id] || (
    <div
      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
      style={{ background: client.color }}
    >
      {client.name[0]}
    </div>
  );
}

interface AIClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (client: typeof AI_CLIENTS[0]) => void;
}

export default function AIClientModal({ isOpen, onClose, onSelect }: AIClientModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = AI_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 z-10">
        {/* Close */}
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle absolute top-3 right-3 text-base-content/40 hover:text-base-content hover:bg-base-200"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-semibold text-base-content mb-1">Choose your AI client</h2>
        <p className="text-sm text-base-content/50 mb-4">Which AI are you powering up?</p>

        {/* Search */}
        <label className="input input-sm input-bordered flex items-center gap-2 mb-4 rounded-lg bg-white border-base-300 focus-within:border-base-content/30 focus-within:outline-none">
          <Search className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow text-sm text-base-content placeholder-base-content/40 outline-none bg-transparent"
          />
        </label>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-0.5">
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelected(client.id)}
              onDoubleClick={() => onSelect(client)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                selected === client.id
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-base-200 hover:border-base-300 hover:bg-base-100 text-base-content"
              }`}
            >
              <ClientIconBadge client={client} />
              <span className="truncate text-xs">{client.name}</span>
            </button>
          ))}
        </div>

        {/* Select button */}
        {selected && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                const client = AI_CLIENTS.find((c) => c.id === selected);
                if (client) onSelect(client);
              }}
              className="btn btn-sm bg-base-content text-base-100 hover:bg-base-content/80 border-none font-medium px-6"
            >
              Select
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
