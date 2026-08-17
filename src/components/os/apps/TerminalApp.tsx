import { useEffect, useRef, useState } from "react";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { parseLuna } from "@/lib/os/luna";
import type { AppId } from "@/lib/os/types";

const APPS: Record<string, AppId> = {
  core: "core",
  office: "office",
  cyber: "cyber",
  files: "files",
  mail: "mail",
  calendar: "calendar",
  notes: "notes",
  settings: "settings",
  luna: "luna",
  browser: "browser",
  calc: "calc",
  editor: "editor",
  photos: "photos",
  monitor: "monitor",
  store: "store",
  clock: "clock",
  paint: "paint",
  tasks: "tasks",
  trash: "trash",
};

export function TerminalApp() {
  const lang = useOs((s) => s.lang);
  const operator = useOs((s) => s.operator);
  const [lines, setLines] = useState<string[]>(() => [t(lang).term.welcome]);
  const [cmd, setCmd] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const cwd = useRef("root");

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const input = raw.trim();
    if (!input) return;
    const [name, ...rest] = input.split(/\s+/);
    const arg = rest.join(" ");
    const out: string[] = [`luna % ${input}`];
    const s = useOs.getState();
    const live = () => s.fs.filter((n) => !n.trashed);
    const here = () => live().filter((n) => n.parent === cwd.current);

    switch (name) {
      case "help":
        out.push("help whoami date status ls cd cat mkdir touch rm mv open ps kill install approvals luna clear");
        break;
      case "whoami":
        out.push(`${operator || "operatore"}@kreluna · sessione locale`);
        break;
      case "date":
        out.push(new Date().toString());
        break;
      case "pwd":
        out.push(live().find((n) => n.id === cwd.current)?.name ?? "/");
        break;
      case "ls":
        out.push(here().map((n) => (n.kind === "folder" ? n.name + "/" : n.name)).join("  ") || "(empty)");
        break;
      case "cd": {
        if (!arg || arg === "/") {
          cwd.current = "root";
          break;
        }
        if (arg === "..") {
          const cur = live().find((n) => n.id === cwd.current);
          cwd.current = cur?.parent ?? "root";
          break;
        }
        const next = here().find((n) => n.name === arg && n.kind === "folder");
        if (next) cwd.current = next.id;
        else out.push(`cd: ${arg}: no such directory`);
        break;
      }
      case "cat": {
        const f = here().find((n) => n.name === arg && n.kind === "file");
        out.push(f?.content ?? `cat: ${arg}: no such file`);
        break;
      }
      case "mkdir":
        if (!arg) out.push("mkdir: missing name");
        else s.createNode(cwd.current, arg, "folder");
        break;
      case "touch":
        if (!arg) out.push("touch: missing name");
        else s.createNode(cwd.current, arg, "file", "", "txt");
        break;
      case "rm": {
        const f = here().find((n) => n.name === arg);
        if (f) s.trashNode(f.id);
        else out.push(`rm: ${arg}: not found`);
        break;
      }
      case "mv": {
        const [a, b] = rest;
        const f = here().find((n) => n.name === a);
        if (f && b) s.renameNode(f.id, b);
        else out.push("mv: usage mv <from> <to>");
        break;
      }
      case "status":
        out.push("kernel   Luna 1.0");
        out.push(`user     ${operator || "operatore"}`);
        out.push(`windows  ${s.wins.length}`);
        out.push(`disk     ${s.fs.filter((n) => !n.trashed).length} nodes`);
        out.push(`queue    ${s.approvals.filter((a) => a.status === "pending").length} pending`);
        break;
      case "ps":
        s.wins.forEach((w) => out.push(`${w.id.slice(0, 10)}  ${w.appId}`));
        if (!s.wins.length) out.push("no user processes");
        break;
      case "kill": {
        const w = s.wins.find((x) => x.id.startsWith(arg) || x.appId === arg);
        if (w) s.closeWin(w.id);
        else out.push("kill: not found");
        break;
      }
      case "install": {
        const id = APPS[arg];
        if (id) {
          s.installApp(id);
          out.push(`installed ${arg}`);
        } else out.push("unknown module");
        break;
      }
      case "approvals":
        s.approvals.forEach((a) => out.push(`${a.status.padEnd(9)} ${a.title}`));
        if (!s.approvals.length) out.push("empty");
        break;
      case "open": {
        const id = APPS[arg.toLowerCase()];
        if (id) {
          s.openApp(id);
          out.push(`opened ${arg}`);
        } else out.push(`unknown app: ${arg}`);
        break;
      }
      case "luna": {
        const liveNow = useOs.getState().fs.filter((n) => !n.trashed);
        const sub = rest[0] ?? "help";
        const target = rest.slice(1).join(" ");
        if (sub === "help" || sub === "") {
          out.push("luna help | inspect <file.luna> | verify <file.luna> | list");
          out.push("Formato LUNA/1 · runtime luna-1 · sigillo luna-fp1");
          break;
        }
        if (sub === "list") {
          liveNow
            .filter((n) => n.mime === "luna")
            .forEach((n) => out.push(n.name));
          break;
        }
        if (sub === "inspect" || sub === "verify") {
          const file =
            liveNow.find((n) => n.name === target) ??
            liveNow.find((n) => n.name.toLowerCase() === target.toLowerCase());
          if (!file) {
            out.push(`luna: ${target || "(file)"} non trovato`);
            break;
          }
          const parsed = parseLuna(file.content ?? "");
          if (!parsed.ok) {
            parsed.issues.forEach((i) => out.push(`err  ${i.code}  ${i.message}`));
            break;
          }
          out.push(`${parsed.pkg.id}  ${parsed.pkg.version}  ${parsed.pkg.kind}`);
          out.push(`seal ${parsed.pkg.seal.fingerprint}`);
          parsed.pkg.permissions.forEach((p) => out.push(`${p.grant.padEnd(6)} ${p.id}  ${p.scope}`));
          break;
        }
        out.push("luna help | inspect | verify | list");
        break;
      }
      case "kernel":
      case "implant": {
        const id = useOs.getState().implant();
        const node = useOs.getState().fs.find((n) => n.id === id);
        out.push("K0  kreluna-k0  init kreluna.init");
        out.push("kreluna  perimetro");
        out.push(node ? `wrote ${node.name}` : "implanted");
        break;
      }
      case "clear":
        setLines([]);
        setCmd("");
        return;
      default:
        out.push(`command not found: ${name}`);
    }
    setLines((l) => [...l, ...out]);
    setCmd("");
  };

  return (
    <div className="flex h-full flex-col bg-ink font-mono text-[12.5px] leading-relaxed text-paper">
      <div ref={box} className="min-h-0 flex-1 overflow-auto px-4 py-3 whitespace-pre-wrap">
        {lines.join("\n")}
      </div>
      <form
        className="flex items-center gap-2 border-t border-line px-4 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(cmd);
        }}
      >
        <span className="text-luna">luna %</span>
        <input
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          className="h-8 flex-1 bg-transparent outline-none"
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
}
