import { readFileSync } from "node:fs";

import { expect, describe, it } from "vitest";

import { transpile } from "../src/Transpile.js";
import { Entry } from "../src/types/Entry.js";

describe("transpile", () => {
  const samples: Array<[file: string, entries: Entry[]]> = [
    ["sample-single.koei", [["Hello"]]],
    ["sample-hello.koei", [[""], ["Hello"]]],
    ["sample-ola.koei", [[""], ["Olá!"]]],
    ["sample-abc.koei", [[""], ["A"], ["BB"], ["CCC"], ["!"]]],
    [
      "sample-attributes.koei",
      [
        ["", Buffer.from("AAAA", "binary")],
        ["Hello", Buffer.from("BBBB", "binary")],
      ],
    ],
    ["sample-empty.koei", [[""]]],
    ["sample-unreliable.koei", [[""], ["A"], ["BB"], ["CCC"], ["!"]]],
  ] as const;

  it.each(samples)("transpile(%j)", (file, expected) => {
    expect(
      transpile(readFileSync(`${__dirname}/fixtures/${file}`)),
    ).toStrictEqual(expected);
  });
});
