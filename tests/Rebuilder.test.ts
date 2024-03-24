import { readFileSync } from "node:fs";

import { expect, describe, it } from "vitest";

import { rebuild } from "../src/Rebuilder.js";
import { Entry } from "../src/types/Entry.js";

describe("rebuild", () => {
  const samples: Array<[entries: Entry[], file: string]> = [
    [[["Hello"]], "sample-single.koei"],
    [[[""], ["Hello"]], "sample-hello.koei"],
    [[[""], ["Olá!"]], "sample-ola.koei"],
    [[[""], ["A"], ["BB"], ["CCC"], ["!"]], "sample-abc.koei"],
    [
      [
        ["", Buffer.from("AAAA", "binary")],
        ["Hello", Buffer.from("BBBB", "binary")],
      ],
      "sample-attributes.koei",
    ],
  ] as const;

  it.each(samples)("rebuild(%j)", (entries, expected) => {
    expect(rebuild(entries)).toStrictEqual(
      readFileSync(`${__dirname}/fixtures/${expected}`),
    );
  });
});
