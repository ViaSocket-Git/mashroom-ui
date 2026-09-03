"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Plus, Search, Trash2, BookOpen, Check, AlertTriangle, Loader2 } from "lucide-react";

import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import {
  fetchSkills,
  fetchClusterSkills,
  fetchSkillContent,
  createSkill,
  updateSkill,
  deleteSkill,
  connectSkill,
  disconnectSkill,
  toggleConnectedLocally,
  clearSkillsError,
} from "../../lib/features/skillsSlice";
import type { Skill } from "../../lib/features/skillsSlice";

// Mirrors the server-side rule: a skill name is surfaced verbatim as an MCP tool name.
const SKILL_NAME_PATTERN = /^[a-zA-Z0-9_-]{1,45}$/;

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "Geist, sans-serif",
  fontSize: 10,
  fontWeight: 600,
  color: "rgb(148,163,184)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 6,
};

const FIELD_STYLE: React.CSSProperties = {
  width: "100%",
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 13,
  color: "rgb(10,10,10)",
  background: "#fff",
  border: "1px solid rgb(226,232,240)",
  borderRadius: 6,
  padding: "8px 12px",
  outline: "none",
};

const STARTER_CONTENT = `# Skill name

## When to use this skill
Describe the situations where the AI should reach for this skill.

## Steps
1. First do this
2. Then do that

## Notes
Anything the AI should keep in mind.`;

interface SkillsModalProps {
  clusterId: string;
  clusterName: string;
  onClose: () => void;
}

type Draft = { name: string; description: string; content: string };

const EMPTY_DRAFT: Draft = { name: "", description: "", content: STARTER_CONTENT };

export default function SkillsModal({ clusterId, clusterName, onClose }: SkillsModalProps) {
  const dispatch = useAppDispatch();

  const skills = useAppSelector((s) => s.skills.skills);
  const loading = useAppSelector((s) => s.skills.loading);
  const fetched = useAppSelector((s) => s.skills.fetched);
  const saving = useAppSelector((s) => s.skills.saving);
  const error = useAppSelector((s) => s.skills.error);
  const contentById = useAppSelector((s) => s.skills.contentById);
  const connectedIds = useAppSelector((s) => s.skills.connectedIdsByClusterId[clusterId]);

  const [query, setQuery] = useState("");
  // null = nothing selected, "new" = creating, otherwise the skill id being edited.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  // Which skill's markdown has already been pushed into the draft, so a body the
  // user deliberately cleared is never silently refilled.
  const [hydratedId, setHydratedId] = useState<string | null>(null);

  const connected = useMemo(() => new Set(connectedIds ?? []), [connectedIds]);

  useEffect(() => {
    dispatch(fetchSkills());
    dispatch(fetchClusterSkills({ mcpServerId: clusterId }));
    return () => { dispatch(clearSkillsError()); };
  }, [dispatch, clusterId]);

  // Pull the markdown body in once a stored skill is opened for editing.
  useEffect(() => {
    if (selectedId && selectedId !== "new") dispatch(fetchSkillContent(selectedId));
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (!selectedId || selectedId === "new") return;
    if (hydratedId === selectedId) return;
    const content = contentById[selectedId];
    if (content === undefined) return;
    setDraft((d) => ({ ...d, content }));
    setHydratedId(selectedId);
  }, [contentById, selectedId, hydratedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [skills, query]);

  function openNew() {
    setSelectedId("new");
    setDraft(EMPTY_DRAFT);
    setHydratedId(null);
    setFormError(null);
  }

  function openSkill(skill: Skill) {
    const cached = contentById[skill.id];
    setSelectedId(skill.id);
    setDraft({
      name: skill.name,
      description: skill.description,
      content: cached ?? "",
    });
    // Cached body goes straight in; otherwise the fetch effect hydrates it.
    setHydratedId(cached !== undefined ? skill.id : null);
    setFormError(null);
  }

  function validate(): string | null {
    if (!SKILL_NAME_PATTERN.test(draft.name)) {
      return "Name must be 1-45 characters, using only letters, numbers, underscores or hyphens.";
    }
    if (!draft.description.trim()) return "Description is required — the AI uses it to decide when to load the skill.";
    if (!draft.content.trim()) return "Instructions are required.";
    return null;
  }

  async function handleSave() {
    const validationError = validate();
    if (validationError) { setFormError(validationError); return; }
    setFormError(null);

    const payload = {
      name: draft.name.trim(),
      description: draft.description.trim(),
      content: draft.content,
    };

    if (selectedId === "new") {
      const result = await dispatch(createSkill(payload));
      if (createSkill.fulfilled.match(result)) {
        const created = result.payload;
        setSelectedId(created._id);
        setHydratedId(created._id);
        // A brand-new skill is almost always meant for the cluster you made it from.
        dispatch(toggleConnectedLocally({ mcpServerId: clusterId, skillId: created._id, connected: true }));
        dispatch(connectSkill({ mcpServerId: clusterId, skillId: created._id }));
      }
    } else if (selectedId) {
      await dispatch(updateSkill({ skillId: selectedId, payload }));
    }
  }

  async function handleDelete(skillId: string) {
    setConfirmDeleteId(null);
    await dispatch(deleteSkill(skillId));
    if (selectedId === skillId) { setSelectedId(null); setDraft(EMPTY_DRAFT); }
  }

  function handleToggleConnect(skillId: string, nextConnected: boolean) {
    dispatch(toggleConnectedLocally({ mcpServerId: clusterId, skillId, connected: nextConnected }));
    dispatch(
      nextConnected
        ? connectSkill({ mcpServerId: clusterId, skillId })
        : disconnectSkill({ mcpServerId: clusterId, skillId })
    );
  }

  const isEditing = selectedId !== null;
  const isNew = selectedId === "new";
  const connectedCount = connected.size;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative flex flex-col"
        style={{
          background: "#fff",
          borderRadius: 14,
          width: "min(980px, 95vw)",
          height: "min(680px, 92vh)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.22)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="shrink-0 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgb(235,237,242)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 38, height: 38, borderRadius: 10, background: "rgb(252,241,236)" }}
            >
              <BookOpen width={18} height={18} strokeWidth={2} style={{ color: "rgb(217,119,87)" }} />
            </div>
            <div className="min-w-0">
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", letterSpacing: "-0.02em" }}>
                Skills
              </h2>
              <p className="truncate" style={{ margin: "1px 0 0", fontSize: 12, color: "rgb(120,132,154)", fontFamily: '"DM Sans", sans-serif' }}>
                {connectedCount} connected to {clusterName}
              </p>
            </div>
          </div>
          <button
            data-testid="skills-modal-close"
            onClick={onClose}
            className="cursor-pointer flex items-center justify-center"
            style={{ background: "transparent", border: "none", color: "rgb(160,170,185)", padding: 4, borderRadius: 6, lineHeight: 0 }}
          >
            <X width={20} height={20} strokeWidth={2} />
          </button>
        </div>

        {error && (
          <div
            className="shrink-0 flex items-center gap-2 px-6 py-2.5"
            style={{ background: "rgb(254,249,242)", borderBottom: "1px solid rgb(253,230,199)" }}
          >
            <AlertTriangle width={13} height={13} strokeWidth={2} style={{ color: "rgb(217,119,6)", flexShrink: 0 }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgb(146,64,14)" }}>{error}</span>
          </div>
        )}

        {/* Body: library on the left, editor on the right */}
        <div className="flex flex-1 min-h-0">

          {/* Library */}
          <div
            className="flex flex-col shrink-0"
            style={{ width: 320, borderRight: "1px solid rgb(226,232,240)", background: "rgb(250,251,253)" }}
          >
            <div className="shrink-0 px-4 pt-4 pb-3 flex flex-col gap-2.5">
              <button
                data-testid="skills-new"
                onClick={openNew}
                className="flex items-center justify-center gap-2 cursor-pointer w-full"
                style={{
                  background: "rgb(10,10,10)", color: "#fff", border: "none", borderRadius: 6,
                  padding: "9px 14px", fontFamily: "Geist, sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em",
                }}
              >
                <Plus width={14} height={14} strokeWidth={2.5} />
                New skill
              </button>
              <div className="flex items-center gap-2 px-3" style={{ background: "#fff", border: "1px solid rgb(226,232,240)", borderRadius: 6, height: 34 }}>
                <Search width={13} height={13} strokeWidth={2} style={{ color: "rgb(148,163,184)", flexShrink: 0 }} />
                <input
                  data-testid="skills-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills"
                  className="flex-1 min-w-0 bg-transparent outline-none"
                  style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12.5, color: "rgb(10,10,10)", border: "none" }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-1.5">
              {!fetched && loading && [1, 2, 3].map((i) => (
                <div key={i} className="px-3 py-2.5" style={{ borderRadius: 6 }}>
                  <div style={{ height: 11, width: "55%", borderRadius: 4, background: "rgb(226,232,240)", animation: "pulse 1.4s ease-in-out infinite" }} />
                  <div style={{ height: 9, width: "85%", borderRadius: 4, background: "rgb(233,238,244)", marginTop: 7, animation: "pulse 1.4s ease-in-out infinite", animationDelay: "0.1s" }} />
                </div>
              ))}

              {fetched && filtered.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-4 py-6 text-center" style={{ background: "#fff", border: "1px dashed rgb(214,221,231)", borderRadius: 8 }}>
                  <BookOpen width={20} height={20} strokeWidth={1.8} style={{ color: "rgb(180,190,204)" }} />
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgb(100,116,139)", margin: 0, lineHeight: 1.45 }}>
                    {skills.length === 0
                      ? "No skills yet. Create one to teach your AI a repeatable procedure."
                      : "No skills match that search."}
                  </p>
                </div>
              )}

              {filtered.map((skill) => {
                const isConnected = connected.has(skill.id);
                const isSelected = selectedId === skill.id;
                return (
                  <div
                    key={skill.id}
                    data-testid={`skill-row-${skill.id}`}
                    onClick={() => openSkill(skill)}
                    className="group/skill relative cursor-pointer"
                    style={{
                      background: isSelected ? "rgb(240,241,243)" : "#fff",
                      border: isSelected ? "1px solid rgb(196,201,212)" : "1px solid rgb(232,235,240)",
                      borderRadius: 6,
                      padding: "9px 11px",
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Connect toggle */}
                      <button
                        data-testid={`skill-toggle-${skill.id}`}
                        onClick={(e) => { e.stopPropagation(); handleToggleConnect(skill.id, !isConnected); }}
                        title={isConnected ? `Disconnect from ${clusterName}` : `Connect to ${clusterName}`}
                        aria-pressed={isConnected}
                        className="shrink-0 flex items-center justify-center cursor-pointer"
                        style={{
                          width: 17, height: 17, marginTop: 1, borderRadius: 4,
                          background: isConnected ? "rgb(10,10,10)" : "#fff",
                          border: isConnected ? "none" : "1.5px solid rgb(203,213,225)",
                          color: "#fff", padding: 0,
                        }}
                      >
                        {isConnected && <Check width={11} height={11} strokeWidth={3} />}
                      </button>

                      <div className="min-w-0 flex-1" style={{ paddingRight: 18 }}>
                        <p className="truncate" style={{ margin: 0, fontFamily: '"Geist Mono", monospace', fontSize: 12.5, fontWeight: 600, color: "rgb(10,10,10)" }}>
                          {skill.name}
                        </p>
                        <p style={{ margin: "2px 0 0", fontFamily: '"DM Sans", sans-serif', fontSize: 11.5, color: "rgb(120,132,154)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {skill.description}
                        </p>
                      </div>

                      <button
                        data-testid={`skill-delete-${skill.id}`}
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(skill.id); }}
                        title="Delete skill"
                        className="absolute opacity-0 group-hover/skill:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        style={{ top: 8, right: 8, width: 20, height: 20, borderRadius: 4, border: "none", background: "transparent", color: "rgb(148,163,184)" }}
                      >
                        <Trash2 width={12} height={12} strokeWidth={2} />
                      </button>
                    </div>

                    {confirmDeleteId === skill.id && (
                      <div
                        className="flex items-center justify-between gap-2 mt-2 pt-2"
                        onClick={(e) => e.stopPropagation()}
                        style={{ borderTop: "1px solid rgb(235,237,242)" }}
                      >
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgb(100,116,139)" }}>
                          Delete permanently?
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="cursor-pointer"
                            style={{ fontFamily: "Geist, sans-serif", fontSize: 11, fontWeight: 600, color: "rgb(100,116,139)", background: "transparent", border: "1px solid rgb(226,232,240)", borderRadius: 4, padding: "3px 9px" }}
                          >
                            Cancel
                          </button>
                          <button
                            data-testid={`skill-delete-confirm-${skill.id}`}
                            onClick={() => handleDelete(skill.id)}
                            className="cursor-pointer"
                            style={{ fontFamily: "Geist, sans-serif", fontSize: 11, fontWeight: 600, color: "#fff", background: "rgb(220,38,38)", border: "none", borderRadius: 4, padding: "4px 10px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            {!isEditing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-10 text-center">
                <div className="flex items-center justify-center" style={{ width: 46, height: 46, borderRadius: 12, background: "rgb(246,248,251)", border: "1px solid rgb(232,236,242)" }}>
                  <BookOpen width={20} height={20} strokeWidth={1.8} style={{ color: "rgb(160,172,188)" }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: "Geist, sans-serif", fontSize: 14, fontWeight: 700, color: "rgb(10,10,10)", letterSpacing: "-0.01em" }}>
                    A skill is a procedure your AI can load
                  </p>
                  <p style={{ margin: "6px 0 0", fontFamily: '"DM Sans", sans-serif', fontSize: 12.5, color: "rgb(100,116,139)", lineHeight: 1.55, maxWidth: 380 }}>
                    Write the instructions once. Connect it to this cluster and it shows up in your AI client
                    as a tool it can call whenever the task comes up.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div style={{ flex: "0 0 240px" }}>
                      <span style={LABEL_STYLE}>Name</span>
                      <input
                        data-testid="skill-name-input"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        placeholder="pdf_processing"
                        style={{ ...FIELD_STYLE, fontFamily: '"Geist Mono", monospace', fontSize: 12.5 }}
                      />
                      <p style={{ margin: "5px 0 0", fontFamily: '"DM Sans", sans-serif', fontSize: 10.5, color: "rgb(148,163,184)", lineHeight: 1.4 }}>
                        Becomes the tool name your AI sees. Letters, numbers, _ and - only.
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span style={LABEL_STYLE}>Description</span>
                      <input
                        data-testid="skill-description-input"
                        value={draft.description}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                        placeholder="Extract text and fill forms in PDF files"
                        style={FIELD_STYLE}
                      />
                      <p style={{ margin: "5px 0 0", fontFamily: '"DM Sans", sans-serif', fontSize: 10.5, color: "rgb(148,163,184)", lineHeight: 1.4 }}>
                        This is how the AI decides when to reach for the skill — be specific.
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <span style={LABEL_STYLE}>Instructions (Markdown)</span>
                    <textarea
                      data-testid="skill-content-input"
                      value={draft.content}
                      onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                      spellCheck={false}
                      style={{
                        ...FIELD_STYLE,
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: 12,
                        lineHeight: 1.65,
                        minHeight: 260,
                        resize: "vertical",
                        padding: "12px 14px",
                      }}
                    />
                  </div>

                  {formError && (
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle width={12} height={12} strokeWidth={2} style={{ color: "rgb(217,119,6)", flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11.5, color: "rgb(146,64,14)", lineHeight: 1.45 }}>{formError}</span>
                    </div>
                  )}
                </div>

                {/* Editor footer */}
                <div
                  className="shrink-0 flex items-center justify-between px-6 py-3.5 gap-3"
                  style={{ borderTop: "1px solid rgb(235,237,242)", background: "rgb(250,251,253)" }}
                >
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11.5, color: "rgb(120,132,154)" }}>
                    {isNew
                      ? `Saving connects it to ${clusterName}.`
                      : connected.has(selectedId as string)
                        ? `Connected to ${clusterName}.`
                        : `Not connected to ${clusterName} — tick it in the list to add it.`}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      data-testid="skill-cancel"
                      onClick={() => { setSelectedId(null); setDraft(EMPTY_DRAFT); setHydratedId(null); setFormError(null); }}
                      className="cursor-pointer"
                      style={{ fontFamily: "Geist, sans-serif", fontSize: 13, fontWeight: 600, color: "rgb(60,60,60)", background: "#fff", border: "1px solid rgb(214,221,231)", borderRadius: 6, padding: "8px 16px" }}
                    >
                      Cancel
                    </button>
                    <button
                      data-testid="skill-save"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 cursor-pointer"
                      style={{
                        fontFamily: "Geist, sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em",
                        color: "#fff", background: "rgb(10,10,10)", border: "none", borderRadius: 6, padding: "8px 20px",
                        opacity: saving ? 0.65 : 1,
                      }}
                    >
                      {saving && <Loader2 width={13} height={13} className="animate-spin" />}
                      {saving ? "Saving…" : isNew ? "Create skill" : "Save changes"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
