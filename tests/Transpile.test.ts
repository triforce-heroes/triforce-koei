import { readFileSync } from "node:fs";

import { expect, describe, it } from "vitest";

import { transpile } from "../src/Transpile.js";
import { EntryContainer } from "../src/types/Entry.js";

describe("transpile", () => {
  const samples: Array<[file: string, entryContainer: EntryContainer]> = [
    ["sample-single.koei", [1, [["Hello"]]]],
    ["sample-hello.koei", [2, [[""], ["Hello"]]]],
    ["sample-ola.koei", [2, [[""], ["Olá!"]]]],
    ["sample-abc.koei", [5, [[""], ["A"], ["BB"], ["CCC"], ["!"]]]],
    [
      "sample-attributes.koei",
      [
        2,
        [
          ["", Buffer.from("AAAA", "binary")],
          ["Hello", Buffer.from("BBBB", "binary")],
        ],
      ],
    ],
    ["sample-empty.koei", [1, [[""]]]],
    ["sample-unreliable.koei", [1, [[""], ["A"], ["BB"], ["CCC"], ["!"]]]],
  ] as const;

  it.each(samples)("transpile(%j)", (file, expected) => {
    expect(
      transpile(readFileSync(`${__dirname}/fixtures/${file}`)),
    ).toStrictEqual(expected);
  });
});
