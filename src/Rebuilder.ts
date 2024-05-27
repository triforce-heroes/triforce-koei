import { BufferBuilder } from "@triforce-heroes/triforce-core/BufferBuilder";

import { Entry } from "./types/Entry.js";

export function rebuild(entries: Entry[], size: number) {
  let offset = entries.length * 4;

  for (const [, entryAttributes] of entries) {
    if (entryAttributes !== undefined) {
      offset += entryAttributes.length;
    }
  }

  const offsets = new BufferBuilder();
  const data = new BufferBuilder();

  for (const [entry, entryAttributes] of entries) {
    offsets.writeUnsignedInt32(offset);

    offset +=
      Buffer.from(entry, "utf8").length +
      1 - // Null terminator.
      4; // Offset length.

    if (entryAttributes !== undefined) {
      offsets.push(entryAttributes);
      offset -= entryAttributes.length;
    }

    data.writeNullTerminatedString(entry);
  }

  const header = new BufferBuilder();

  header.writeUnsignedInt32(size);
  header.writeUnsignedInt32(data.length);
  header.pad(16);

  return Buffer.concat([header.build(), offsets.build(), data.build()]);
}
