import { readFileSync } from "node:fs";

import { expect, describe, it } from "vitest";

import { rebuild } from "../src/Rebuilder.js";
import { Entry } from "../src/types/Entry.js";

describe("rebuild", () => {
  const samples: Array<[entries: Entry[], size: number, file: string]> = [
    [[["Hello"]], 1, "sample-single.koei"],
    [[[""], ["Hello"]], 2, "sample-hello.koei"],
    [[[""], ["Olá!"]], 2, "sample-ola.koei"],
    [[[""], ["A"], ["BB"], ["CCC"], ["!"]], 5, "sample-abc.koei"],
    [
      [
        ["", Buffer.from("AAAA", "binary")],
        ["Hello", Buffer.from("BBBB", "binary")],
      ],
      2,
      "sample-attributes.koei",
    ],
    [[[""]], 1, "sample-empty.koei"],
    [[[""], ["A"], ["BB"], ["CCC"], ["!"]], 1, "sample-unreliable.koei"],
    [
      [
        [
          "Hello",
          Buffer.from(
            "\u00AA\u00AA\u00AA\u00AA\u00BB\u00BB\u00BB\u00BB\u00CC\u00CC\u00CC\u00CC",
            "binary",
          ),
        ],
      ],
      1,
      "sample-bug-0001.koei",
    ],
    [
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
      1,
      "sample-bug-0002.koei",
    ],
    [
      [["A"], ["B"], ["C", Buffer.from("\u0001\u0002\u0003\u0000", "binary")]],
      3,
      "sample-bug-0003.koei",
    ],
    [
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
      4,
      "sample-bug-0004.koei",
    ],
  ] as const;

  it.each(samples)("rebuild(%j, %j)", (entries, size, expected) => {
    expect(rebuild(entries, size)).toStrictEqual(
      readFileSync(`${__dirname}/fixtures/${expected}`),
    );
  });
});
