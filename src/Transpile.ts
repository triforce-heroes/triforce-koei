import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

import { Entry } from "./types/Entry.js";

export function transpile(buffer: Buffer) {
  const consumer = new BufferConsumer(buffer);

  const entries: Entry[] = [];
  const entriesCount = consumer.readUnsignedInt32();

  const dataSize = consumer.readUnsignedInt32();
  const offsetSize = consumer.skip(8).readUnsignedInt32() / entriesCount;

  consumer.seek(buffer.length - dataSize);

  if (offsetSize === 4) {
    for (let i = 0; i < entriesCount; i++) {
      entries.push([consumer.readNullTerminatedString()]);
    }
  } else {
    const offsetConsumer = new BufferConsumer(
      buffer.subarray(16, 16 + entriesCount * offsetSize),
    );

    for (let i = 0; i < entriesCount; i++) {
      offsetConsumer.skip(4);

      entries.push([
        consumer.readNullTerminatedString(),
        offsetConsumer.read(offsetSize - 4),
      ]);
    }
  }

  return entries;
}
