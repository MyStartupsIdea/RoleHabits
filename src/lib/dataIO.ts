import type { AppState } from "./store";

export function exportData(state: AppState): void {
  const payload = {
    app: "RoleHabits",
    version: 1,
    exportedAt: new Date().toISOString(),
    state,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `rolehabits-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ImportedPayload {
  app?: string;
  version?: number;
  state?: Partial<AppState>;
}

export function parseImportedFile(text: string): Partial<AppState> | null {
  try {
    const data = JSON.parse(text) as ImportedPayload;
    // Support both wrapped and raw state formats
    if (data.state && typeof data.state === "object") {
      return data.state;
    }
    // Raw state (no wrapper)
    if (
      data &&
      typeof data === "object" &&
      ("habits" in data || "onboarded" in data || "xp" in data)
    ) {
      return data as Partial<AppState>;
    }
    return null;
  } catch {
    return null;
  }
}
