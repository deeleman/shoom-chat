export type UserMediaData = {
  stream?: MediaStream;
  name?: string;
  setName: (name: string) => void;
}
