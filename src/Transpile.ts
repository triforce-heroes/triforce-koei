import { BufferBuilder } from "@triforce-heroes/triforce-core/BufferBuilder";
import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

import { Entry, EntryContainer } from "./types/Entry.js";

export function transpile(buffer: Buffer): EntryContainer {
  const entries: Entry[] = [];

  const consumer = new BufferConsumer(buffer);

  const dataHeader = consumer.readUnsignedInt32();
  const dataSize = consumer.readUnsignedInt32();
  let dataOffset = buffer.length - dataSize - 16;

  const offsetsConsumer = consumer.skip(8).consumer(dataOffset);

  let dataOffsetEntry: string | null = null;
  let dataOffsetBuffer = new BufferBuilder();

  const dataConsumer = new BufferConsumer(buffer, dataOffset + 16);

  function entryPush() {
    if (dataOffsetEntry !== null) {
      if (dataOffsetBuffer.length > 0) {
        entries.push([dataOffsetEntry, dataOffsetBuffer.build()]);

        dataOffsetBuffer = new BufferBuilder();
      } else {
        entries.push([dataOffsetEntry]);
      }

      dataOffsetEntry = null;
    }
  }

  while (!offsetsConsumer.isConsumed()) {
    const consumerSection = offsetsConsumer.readUnsignedInt32();

    if (consumerSection === dataOffset) {
      entryPush();

      dataOffsetEntry = dataConsumer.readNullTerminatedString();
      dataOffset += Buffer.from(dataOffsetEntry, "utf8").length + 1;
    } else {
      dataOffsetBuffer.writeUnsignedInt32(consumerSection);
    }

    dataOffset -= 4;
  }

  entryPush();

  return [dataHeader, entries];
}
