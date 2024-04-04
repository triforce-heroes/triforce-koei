/// <reference types="node" resolution-mode="require"/>
export type Entry = [data: string, attribute?: Buffer];
export type EntryContainer = [size: number, entries: Entry[]];
