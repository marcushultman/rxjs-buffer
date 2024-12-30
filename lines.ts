import { buffer } from './buffer.ts';

export const splitLines = () =>
  buffer(
    (buffer, chunk: string) => {
      const lines = (buffer + chunk).split('\n');
      return [lines.pop() ?? '', lines];
    },
    '',
  );
export default splitLines;
