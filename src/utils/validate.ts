export function validate(buffer: Buffer) {
  if (buffer.length <= 20) {
    return false;
  }

  const entriesCount = buffer.readUInt32LE(0);
  const dataSize = buffer.readUInt32LE(4);

  if (entriesCount === 0 || dataSize === 0 || entriesCount === dataSize) {
    return false;
  }

  const entryIndex = buffer.readUInt32LE(16);

  return buffer.length - dataSize - 16 === entryIndex;
}
