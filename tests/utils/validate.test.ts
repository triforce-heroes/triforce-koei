import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { validate } from "../../src/utils/validate.js";

describe("utils/validate", () => {
  const samples: Array<[file: string, expected: boolean]> = [
    ["invalid-data-size.koei", false],
    ["invalid-entries-count.koei", false],
    ["invalid-sample.koei", false],
    ["invalid-size.koei", false],
    ["sample-single.koei", true],
    ["sample-hello.koei", true],
    ["sample-ola.koei", true],
    ["sample-attributes.koei", true],
  ];

  it.each(samples)("validate(%j)", (file, expected) => {
    expect(validate(readFileSync(`${__dirname}/../fixtures/${file}`))).toBe(
      expected,
    );
  });
});
