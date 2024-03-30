import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

import { Entry } from "./types/Entry.js";

export function transpile(buffer: Buffer): Entry[] {
  const consumer = new BufferConsumer(buffer, 4);

  const dataSize = consumer.readUnsignedInt32();
  const dataEntries: string[] = [];

  consumer.seek(buffer.length - dataSize);

  while (!consumer.isConsumed()) {
    dataEntries.push(consumer.readNullTerminatedString());
  }

  const attributesSize =
    (buffer.length - dataSize - 16) / dataEntries.length - 4;

  if (attributesSize === 0) {
    return dataEntries.map((entry) => [entry]);
  }

  consumer.seek(16);

  const entries: Entry[] = [];

  for (const dataEntry of dataEntries) {
    consumer.skip(4);

    entries.push([dataEntry, consumer.read(attributesSize)]);
  }

  return entries;
}
