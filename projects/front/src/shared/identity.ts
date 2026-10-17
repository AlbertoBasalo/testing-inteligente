import applicationPackage from "../../../../package.json";

type PackageAuthor = string | { name: string; url?: string };
interface SystemPackage {
  name: string;
  displayName?: string;
  description?: string;
  author?: PackageAuthor;
  homepage?: string;
  version: string;
}
const system: SystemPackage = applicationPackage;
const defaults = { author: "AIDDbot", website: "https://aiddbot.com" };
function readAuthorName(author: PackageAuthor | undefined): string {
  if (author === undefined) return defaults.author;
  return typeof author === "string" ? author : author.name;
}

export const identity = {
  name: system.displayName ?? system.name,
  description: system.description ?? "",
  author: readAuthorName(system.author),
  website: system.homepage ?? defaults.website,
  version: system.version,
};
