import "server-only";

const url = new URL(process.env.APP_URL ?? "http://bacurim.mamura.test");

if (!["http:", "https:"].includes(url.protocol)) {
  throw new Error("APP_URL must use HTTP or HTTPS.");
}

export const appConfig = {
  name: "Bacurim",
  description: "Gestão financeira com clareza para o seu negócio.",
  locale: "pt-BR",
  url,
} as const;
