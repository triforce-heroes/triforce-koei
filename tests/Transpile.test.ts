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
    [
      "sample-bug-0001.koei",
      [
        1,
        [
          [
            "Hello",
            Buffer.from(
              "\u00AA\u00AA\u00AA\u00AA\u00BB\u00BB\u00BB\u00BB\u00CC\u00CC\u00CC\u00CC",
              "binary",
            ),
          ],
        ],
      ],
    ],
    [
      "sample-bug-0002.koei",
      [
        1,
        [
          [
            "A",
            Buffer.from(
              "\u00AA\u00AA\u00AA\u00AA\u00AA\u00AA\u00AA\u00AA\u00AA\u00AA\u00AA\u00AA",
              "binary",
            ),
          ],
          [
            "B",
            Buffer.from(
              "\u00BB\u00BB\u00BB\u00BB\u00BB\u00BB\u00BB\u00BB\u00BB\u00BB\u00BB\u00BB",
              "binary",
            ),
          ],
        ],
      ],
    ],
    [
      "sample-bug-0003.koei",
      [
        3,
        [
          ["A"],
          ["B"],
          ["C", Buffer.from("\u0001\u0002\u0003\u0000", "binary")],
        ],
      ],
    ],
    [
      "sample-bug-0004.koei",
      [
        4,
        [
          ["A"],
          ["B", Buffer.from("\u0001\u0001\u0001\u0001", "binary")],
          ["C"],
          ["D", Buffer.from("\u0001\u0001\u0002\u0001", "binary")],
          ["E"],
          ["F", Buffer.from("\u0001\u0001\u0002\u0001", "binary")],
          ["G"],
          ["H", Buffer.from("\u0001\u0000\u0000\u0001", "binary")],
        ],
      ],
    ],
  ] as const;

  it.each(samples)("transpile(%j)", (file, expected) => {
    expect(
      transpile(readFileSync(`${__dirname}/fixtures/${file}`)),
    ).toStrictEqual(expected);
  });
});
