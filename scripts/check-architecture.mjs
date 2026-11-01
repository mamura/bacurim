import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

export function checkArchitecture(root = process.cwd()) {
  const src = path.join(root, "src");
  const configPath = path.join(root, "tsconfig.json");
  const result = ts.readConfigFile(configPath, ts.sys.readFile);
  if (result.error)
    throw new Error(
      ts.flattenDiagnosticMessageText(result.error.messageText, "\n"),
    );
  const parsed = ts.parseJsonConfigFileContent(
    result.config,
    ts.sys,
    root,
    {},
    configPath,
  );
  if (parsed.errors.length)
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(parsed.errors, {
        getCanonicalFileName: (name) => name,
        getCurrentDirectory: () => root,
        getNewLine: () => "\n",
      }),
    );
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const name = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(name);
      else if (/\.tsx?$/.test(name) && !name.endsWith(".d.ts"))
        files.push(name);
    }
  }
  walk(src);
  const relative = (file) =>
    path.relative(root, file).split(path.sep).join("/");
  const classify = (file) => {
    const parts = relative(file).split("/");
    return {
      layer: parts[1],
      feature: parts[1] === "features" ? parts[2] : undefined,
    };
  };
  const errors = new Set();
  const graph = new Map();
  const clients = new Set();
  const servers = new Set();
  for (const file of files) {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    const specs = [];
    function visit(node) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        specs.push(node.moduleSpecifier.text);
      }
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        specs.push(node.arguments[0].text);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
    if (
      source.statements.some(
        (statement) =>
          ts.isExpressionStatement(statement) &&
          ts.isStringLiteral(statement.expression) &&
          statement.expression.text === "use client",
      )
    )
      clients.add(file);
    if (specs.includes("server-only")) servers.add(file);
    const dependencies = [];
    for (const spec of specs) {
      if (spec.startsWith("bacurim-ui/") && spec !== "bacurim-ui/styles.css")
        errors.add(relative(file) + ": import interno de bacurim-ui: " + spec);
      if (spec.endsWith(".css")) continue;
      const resolved = ts.resolveModuleName(spec, file, parsed.options, ts.sys)
        .resolvedModule?.resolvedFileName;
      if (!resolved) {
        if (
          spec.startsWith(".") ||
          spec.startsWith("@/") ||
          spec.startsWith("@features/") ||
          spec.startsWith("@shared/")
        ) {
          errors.add(relative(file) + ": import local não resolvido: " + spec);
        }
        continue;
      }
      if (!resolved.startsWith(src + path.sep) || resolved.endsWith(".d.ts"))
        continue;
      dependencies.push(resolved);
      const from = classify(file),
        to = classify(resolved);
      const edge = relative(file) + " -> " + relative(resolved);
      if (from.layer === "shared" && to.layer !== "shared")
        errors.add("shared não depende de " + to.layer + ": " + edge);
      if (from.layer === "features" && to.layer === "app")
        errors.add("feature não depende de app: " + edge);
      if (
        from.layer === "features" &&
        to.layer === "features" &&
        from.feature !== to.feature
      )
        errors.add("dependência entre features: " + edge);
      if (
        to.layer === "features" &&
        (from.layer !== "features" || from.feature !== to.feature)
      ) {
        const entry = path
          .relative(path.join(src, "features", to.feature), resolved)
          .split(path.sep)
          .join("/");
        if (!["index.ts", "server.ts", "types.ts"].includes(entry))
          errors.add("entrada privada de feature: " + edge);
      }
    }
    graph.set(file, dependencies);
  }

  const visited = new Set(),
    active = new Set(),
    stack = [];
  function detectCycle(file) {
    if (active.has(file)) {
      const cycle = stack.slice(stack.indexOf(file)).concat(file).map(relative);
      errors.add("dependência circular: " + cycle.join(" -> "));
      return;
    }
    if (visited.has(file)) return;
    active.add(file);
    stack.push(file);
    for (const next of graph.get(file) ?? []) detectCycle(next);
    stack.pop();
    active.delete(file);
    visited.add(file);
  }
  for (const file of files) detectCycle(file);

  for (const client of clients) {
    const seen = new Set();
    function checkServer(file, chain) {
      if (seen.has(file)) return;
      seen.add(file);
      if (servers.has(file))
        errors.add(
          "server-only no grafo cliente: " + chain.map(relative).join(" -> "),
        );
      for (const next of graph.get(file) ?? [])
        checkServer(next, [...chain, next]);
    }
    checkServer(client, [client]);
  }
  return { files: files.length, errors: [...errors] };
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  const report = checkArchitecture();
  if (report.errors.length) {
    console.error(report.errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      "Architecture verified: " +
        report.files +
        " modules, no forbidden imports or cycles.",
    );
  }
}
