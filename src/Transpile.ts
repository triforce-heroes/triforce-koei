import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

import { Entry, EntryContainer } from "./types/Entry.js";

export function transpile(buffer: Buffer): EntryContainer {
  const consumer = new BufferConsumer(buffer);

  const dataHeader = consumer.readUnsignedInt32();
  const dataSize = consumer.readUnsignedInt32();
  const dataEntries: string[] = [];

  consumer.seek(buffer.length - dataSize);

  while (!consumer.isConsumed()) {
    dataEntries.push(consumer.readNullTerminatedString());
  }

  const attributesSize =
    (buffer.length - dataSize - 16) / dataEntries.length - 4;

  if (attributesSize === 0) {
    return [dataHeader, dataEntries.map((entry) => [entry])];
  }

  consumer.seek(16);

  const entries: Entry[] = [];

  for (const dataEntry of dataEntries) {
    consumer.skip(4);

    entries.push([dataEntry, consumer.read(attributesSize)]);
  }

  return [dataHeader, entries];
}
