// 没有用上这个，但感觉后面会有用，先留着吧
export function randomIdentifier(target: Object, len: number = 32) {
  const reserved = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "let",
    "static",
    "await",
    "implements",
    "package",
    "protected",
    "interface",
    "private",
    "public",
  ]);
  const head = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_";
  const tail = head + "0123456789";
  const exists = new Set([
    ...reserved,
    ...Object.getOwnPropertyNames(target),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(target) || {}),
    ...Object.getOwnPropertyNames(Object.prototype),
  ]);
  let name: string;
  do {
    name = head[(Math.random() * head.length) | 0];
    for (let i = 1; i < len; i++) {
      name += tail[(Math.random() * tail.length) | 0];
    }
  } while (exists.has(name));
  return name;
}
