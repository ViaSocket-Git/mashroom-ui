import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { skillApi } from "../api/skillApi";
import type { ApiSkill, SkillPayload } from "../api/skillApi";

export interface Skill {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface SkillsState {
  /** The org-wide skill library, newest first. */
  skills: Skill[];
  loading: boolean;
  fetched: boolean;
  saving: boolean;
  error: string | null;
  /** Markdown bodies, fetched on demand since the list endpoint omits them. */
  contentById: Record<string, string>;
  /** Which skills each cluster (MCP server) has connected. */
  connectedIdsByClusterId: Record<string, string[]>;
  loadingConnectedFor: Record<string, boolean>;
}

const initialState: SkillsState = {
  skills: [],
  loading: false,
  fetched: false,
  saving: false,
  error: null,
  contentById: {},
  connectedIdsByClusterId: {},
  loadingConnectedFor: {},
};

function toSkill(s: ApiSkill): Skill {
  return {
    id: s._id,
    name: s.name,
    description: s.description,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

function errorMessage(err: unknown, fallback: string) {
  const apiMessage = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
  return apiMessage?.error || apiMessage?.message || (err instanceof Error ? err.message : fallback);
}

export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const res = await skillApi.getSkills();
      return (res.data?.data ?? []).map(toSkill);
    } catch (err: unknown) {
      return rejectWithValue(errorMessage(err, "Failed to load skills"));
    }
  }
);

export const fetchSkillContent = createAsyncThunk(
  "skills/fetchSkillContent",
  async (skillId: string, { rejectWithValue }) => {
    try {
      const res = await skillApi.getSkill(skillId);
      return { skillId, content: res.data?.data?.content ?? "" };
    } catch (err: unknown) {
      return rejectWithValue(errorMessage(err, "Failed to load skill"));
    }
  },
  {
    condition: (skillId, { getState }) => {
      const state = getState() as { skills: SkillsState };
      return state.skills.contentById[skillId] === undefined;
    },
  }
);

export const createSkill = createAsyncThunk(
  "skills/createSkill",
  async (payload: SkillPayload, { rejectWithValue }) => {
    try {
      const res = await skillApi.createSkill(payload);
      return res.data.data;
    } catch (err: unknown) {
      return rejectWithValue(errorMessage(err, "Failed to create skill"));
    }
  }
);

export const updateSkill = createAsyncThunk(
  "skills/updateSkill",
  async ({ skillId, payload }: { skillId: string; payload: Partial<SkillPayload> }, { rejectWithValue }) => {
    try {
      const res = await skillApi.updateSkill(skillId, payload);
      return res.data.data;
    } catch (err: unknown) {
      return rejectWithValue(errorMessage(err, "Failed to update skill"));
    }
  }
);

export const deleteSkill = createAsyncThunk(
  "skills/deleteSkill",
  async (skillId: string, { rejectWithValue }) => {
    try {
      await skillApi.deleteSkill(skillId);
      return skillId;
    } catch (err: unknown) {
      return rejectWithValue(errorMessage(err, "Failed to delete skill"));
    }
  }
);

export const fetchClusterSkills = createAsyncThunk(
  "skills/fetchClusterSkills",
  async ({ mcpServerId }: { mcpServerId: string }, { rejectWithValue }) => {
    try {
      const res = await skillApi.getSkillsByMcpId(mcpServerId);
      return { mcpServerId, skills: res.data?.data ?? [] };
    } catch (err: unknown) {
      return rejectWithValue(errorMessage(err, "Failed to load connected skills"));
    }
  }
);

export const connectSkill = createAsyncThunk(
  "skills/connectSkill",
  async ({ mcpServerId, skillId }: { mcpServerId: string; skillId: string }, { rejectWithValue }) => {
    try {
      await skillApi.connectSkill(mcpServerId, skillId);
      return { mcpServerId, skillId };
    } catch (err: unknown) {
      return rejectWithValue(errorMessage(err, "Failed to connect skill"));
    }
  }
);

export const disconnectSkill = createAsyncThunk(
  "skills/disconnectSkill",
  async ({ mcpServerId, skillId }: { mcpServerId: string; skillId: string }, { rejectWithValue }) => {
    try {
      await skillApi.disconnectSkill(mcpServerId, skillId);
      return { mcpServerId, skillId };
    } catch (err: unknown) {
      return rejectWithValue(errorMessage(err, "Failed to disconnect skill"));
    }
  }
);

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    clearSkillsError(state) {
      state.error = null;
    },
    // Optimistic flip so the toggle responds instantly; the thunk reconciles.
    toggleConnectedLocally(state, action: PayloadAction<{ mcpServerId: string; skillId: string; connected: boolean }>) {
      const { mcpServerId, skillId, connected } = action.payload;
      const current = state.connectedIdsByClusterId[mcpServerId] ?? [];
      state.connectedIdsByClusterId[mcpServerId] = connected
        ? Array.from(new Set([...current, skillId]))
        : current.filter((id) => id !== skillId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.error = action.payload as string;
      })

      .addCase(fetchSkillContent.fulfilled, (state, action) => {
        state.contentById[action.payload.skillId] = action.payload.content;
      })

      .addCase(createSkill.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.saving = false;
        const skill = action.payload;
        state.skills.unshift(toSkill(skill));
        if (skill.content !== undefined) state.contentById[skill._id] = skill.content;
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })

      .addCase(updateSkill.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.saving = false;
        const skill = action.payload;
        if (!skill?._id) return;
        const idx = state.skills.findIndex((s) => s.id === skill._id);
        if (idx !== -1) state.skills[idx] = toSkill(skill);
        if (skill.content !== undefined) state.contentById[skill._id] = skill.content;
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })

      .addCase(deleteSkill.fulfilled, (state, action) => {
        const skillId = action.payload;
        state.skills = state.skills.filter((s) => s.id !== skillId);
        delete state.contentById[skillId];
        // The server detaches a deleted skill from every MCP server, so mirror that here.
        Object.keys(state.connectedIdsByClusterId).forEach((clusterId) => {
          state.connectedIdsByClusterId[clusterId] =
            state.connectedIdsByClusterId[clusterId].filter((id) => id !== skillId);
        });
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchClusterSkills.pending, (state, action) => {
        state.loadingConnectedFor[action.meta.arg.mcpServerId] = true;
      })
      .addCase(fetchClusterSkills.fulfilled, (state, action) => {
        const { mcpServerId, skills } = action.payload;
        state.connectedIdsByClusterId[mcpServerId] = skills.map((s) => s._id);
        skills.forEach((s) => {
          if (s.content !== undefined) state.contentById[s._id] = s.content;
        });
        state.loadingConnectedFor[mcpServerId] = false;
      })
      .addCase(fetchClusterSkills.rejected, (state, action) => {
        state.loadingConnectedFor[action.meta.arg.mcpServerId] = false;
      })

      .addCase(connectSkill.fulfilled, (state, action) => {
        const { mcpServerId, skillId } = action.payload;
        const current = state.connectedIdsByClusterId[mcpServerId] ?? [];
        state.connectedIdsByClusterId[mcpServerId] = Array.from(new Set([...current, skillId]));
      })
      .addCase(connectSkill.rejected, (state, action) => {
        // Roll the optimistic flip back.
        const { mcpServerId, skillId } = action.meta.arg;
        state.connectedIdsByClusterId[mcpServerId] =
          (state.connectedIdsByClusterId[mcpServerId] ?? []).filter((id) => id !== skillId);
        state.error = action.payload as string;
      })

      .addCase(disconnectSkill.fulfilled, (state, action) => {
        const { mcpServerId, skillId } = action.payload;
        state.connectedIdsByClusterId[mcpServerId] =
          (state.connectedIdsByClusterId[mcpServerId] ?? []).filter((id) => id !== skillId);
      })
      .addCase(disconnectSkill.rejected, (state, action) => {
        const { mcpServerId, skillId } = action.meta.arg;
        const current = state.connectedIdsByClusterId[mcpServerId] ?? [];
        state.connectedIdsByClusterId[mcpServerId] = Array.from(new Set([...current, skillId]));
        state.error = action.payload as string;
      });
  },
});

export const { clearSkillsError, toggleConnectedLocally } = skillsSlice.actions;

export default skillsSlice.reducer;
