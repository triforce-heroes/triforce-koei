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
  ] as const;

  it.each(samples)("rebuild(%j, %j)", (entries, size, expected) => {
    expect(rebuild(entries, size)).toStrictEqual(
      readFileSync(`${__dirname}/fixtures/${expected}`),
    );
  });
});
