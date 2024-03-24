import { BufferBuilder } from "@triforce-heroes/triforce-core/BufferBuilder";

import { Entry } from "./types/Entry.js";

export function rebuild(entries: Entry[]) {
  const entrySample = entries[0]!;
  const [, entrySampleAttribute] = entrySample;

  const offsetSize = 4 + (entrySampleAttribute ?? "").length;
  const offsetsSize = entries.length * offsetSize;
  const offsets = Buffer.allocUnsafe(offsetsSize);

  const data = new BufferBuilder();

  for (const [entryIndex, [entry, entryAttribute]] of entries.entries()) {
    const offset = entryIndex * offsetSize;

    offsets.writeUInt32LE(offsetsSize - offset + data.length, offset);

    entryAttribute?.copy(offsets, offset + 4);

    data.writeNullTerminatedString(entry);
  }

  const header = new BufferBuilder();

  header.writeUnsignedInt32(entries.length);
  header.writeUnsignedInt32(data.length);
  header.pad(16);

  return Buffer.concat([header.build(), offsets, data.build()]);
}
