import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  emitFightAiQChunks,
  splitFightAiQDelivery,
} from "../scripts/emit-fightaiq-chunks.mjs";

const root = path.resolve(import.meta.dirname, "..");
const input = path.join(root, "data/boardless/fightaiq.json");

test("splits the current delivery into honest surface-specific datasets", async () => {
  const source = JSON.parse(await readFile(input, "utf8"));
  const chunks = splitFightAiQDelivery(source);

  assert.equal(chunks.predictions.surface, "predictions");
  assert.equal(chunks.results.surface, "results");
  assert.equal(chunks.fighters.surface, "fighters");
  assert.equal(chunks.fighters.fighters.length, 92);
  assert.ok(chunks.predictions.events.some((event) => event.org === "ufc"));
  assert.ok(chunks.results.bouts.some((bout) => bout.org === "ufc"));
  assert.ok(chunks.results.bouts.some((bout) => bout.org === "oktagon"));
  assert.ok(chunks.results.bouts.every((bout) => bout.status === "completed" && bout.result));
  assert.equal("fighters" in chunks.predictions, false);
  assert.equal("events" in chunks.fighters, false);
  assert.equal("bouts" in chunks.fighters, false);
});

test("emits three files that are each smaller than the source snapshot", async () => {
  const output = await mkdtemp(path.join(os.tmpdir(), "mma-files-fightaiq-"));
  try {
    await emitFightAiQChunks({ input, output });
    const sourceSize = (await stat(input)).size;
    for (const name of ["predictions", "results", "fighters"]) {
      const file = path.join(output, `${name}.json`);
      assert.ok((await stat(file)).size < sourceSize, `${name} must stay smaller than the full snapshot`);
      assert.equal(JSON.parse(await readFile(file, "utf8")).surface, name);
    }
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("reader modules do not import the full FightAIQ snapshot or select content from the clock", async () => {
  const boardless = await readFile(path.join(root, "src/lib/boardless.ts"), "utf8");
  const repository = await readFile(path.join(root, "src/lib/repository.ts"), "utf8");
  assert.doesNotMatch(boardless, /data\/boardless\/fightaiq\.json/u);
  assert.doesNotMatch(`${boardless}\n${repository}`, /new Date\(\s*\)|Date\.now\(\)|Math\.random\(\)/u);
});
