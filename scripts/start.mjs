// Starts the back and front servers in parallel.
// Usage: node scripts/start.mjs
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const projects = [
  { name: "back", color: "\x1b[36m" },
  { name: "front", color: "\x1b[35m" },
];
const reset = "\x1b[0m";
const children = [];

function prefixLines(project, chunk) {
  const label = `${project.color}[${project.name}]${reset} `;
  return chunk
    .toString()
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => label + line)
    .join("\n");
}

// On Windows, kill() stops only the shell; taskkill /T stops the whole process tree.
function stopChild(child) {
  if (child.exitCode !== null) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"]);
    return;
  }
  child.kill();
}

function stopAll(exitCode) {
  children.forEach(stopChild);
  process.exitCode = exitCode;
}

function startProject(project) {
  const child = spawn("npm start", {
    cwd: join(root, "projects", project.name),
    shell: true,
  });
  child.stdout.on("data", (chunk) => console.log(prefixLines(project, chunk)));
  child.stderr.on("data", (chunk) => console.error(prefixLines(project, chunk)));
  child.on("exit", (code) => {
    console.log(prefixLines(project, `exited with code ${code}`));
    stopAll(code ?? 0);
  });
  children.push(child);
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
projects.forEach(startProject);
