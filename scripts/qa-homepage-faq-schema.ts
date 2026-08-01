/**
 * Verify the rendered homepage FAQPage markup against its visible FAQs.
 * Usage: pnpm qa:homepage-faq-schema [baseUrl]
 */

export {};

const BASE =
  process.argv[2]?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";

const HOMEPAGES = [
  { locale: "en", path: "/" },
  { locale: "hi", path: "/hi" },
  { locale: "te", path: "/te" },
] as const;

type JsonLd = Record<string, unknown>;

function decodeHtml(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function parseJsonLd(html: string): JsonLd[] {
  return Array.from(
    html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
    (match) => JSON.parse(decodeHtml(match[1] ?? "")) as JsonLd,
  );
}

function findFaqPage(nodes: JsonLd[]): JsonLd | undefined {
  for (const node of nodes) {
    if (node["@type"] === "FAQPage") return node;
    const graph = node["@graph"];
    if (Array.isArray(graph)) {
      const faq = graph.find(
        (entry): entry is JsonLd =>
          typeof entry === "object" &&
          entry !== null &&
          (entry as JsonLd)["@type"] === "FAQPage",
      );
      if (faq) return faq;
    }
  }
  return undefined;
}

async function main() {
  for (const homepage of HOMEPAGES) {
    const url = `${BASE}${homepage.path}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${homepage.locale}: ${url} returned ${response.status}.`);
    }

    const html = await response.text();
    const schema = findFaqPage(parseJsonLd(html));
    if (!schema) {
      throw new Error(`${homepage.locale}: FAQPage schema is missing.`);
    }

    const entities = schema.mainEntity;
    if (!Array.isArray(entities) || entities.length !== 4) {
      throw new Error(
        `${homepage.locale}: expected 4 FAQ entities, found ${Array.isArray(entities) ? entities.length : 0}.`,
      );
    }

    const visibleHtml = decodeHtml(
      html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ""),
    );

    for (const [index, entity] of entities.entries()) {
      if (
        typeof entity !== "object" ||
        entity === null ||
        (entity as JsonLd)["@type"] !== "Question"
      ) {
        throw new Error(`${homepage.locale}: FAQ ${index + 1} is not a Question.`);
      }

      const question = (entity as JsonLd).name;
      const acceptedAnswer = (entity as JsonLd).acceptedAnswer;
      const answer =
        typeof acceptedAnswer === "object" && acceptedAnswer !== null
          ? (acceptedAnswer as JsonLd).text
          : undefined;

      if (typeof question !== "string" || typeof answer !== "string") {
        throw new Error(
          `${homepage.locale}: FAQ ${index + 1} is missing question or answer text.`,
        );
      }
      if (!visibleHtml.includes(question) || !visibleHtml.includes(answer)) {
        throw new Error(
          `${homepage.locale}: FAQ ${index + 1} does not match visible copy.`,
        );
      }
    }

    console.log(
      `✓ ${homepage.locale}: 4 valid FAQ entities match the visible questions and answers.`,
    );
  }
}

main();
