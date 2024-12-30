import { from, lastValueFrom, toArray } from 'rxjs';
import { assertEquals } from '@std/assert';
import splitLines from './lines.ts';

Deno.test('Split lines - Basic splitting of chunks into lines', async () => {
  assertEquals(
    await lastValueFrom(
      from(['Hello wo', 'rld\nThis ', 'is a test\nAnother line']).pipe(
        splitLines(),
        toArray(),
      ),
    ),
    ['Hello world', 'This is a test', 'Another line'],
  );
});

Deno.test('Split lines - All lines are complete', async () => {
  assertEquals(
    await lastValueFrom(
      from(['Line1\nLine2\nLine3\n']).pipe(splitLines(), toArray()),
    ),
    ['Line1', 'Line2', 'Line3', ''],
  );
});

Deno.test('Split lines - No complete lines but emits remaining buffer on complete', async () => {
  assertEquals(
    await lastValueFrom(
      from(['Incomplete ', 'line with no newline']).pipe(
        splitLines(),
        toArray(),
      ),
    ),
    ['Incomplete line with no newline'],
  );
});

Deno.test('Split lines - Multiple chunks with complete lines', async () => {
  assertEquals(
    await lastValueFrom(
      from(['Multi\nLine\n', 'Example\n']).pipe(splitLines(), toArray()),
    ),
    ['Multi', 'Line', 'Example', ''],
  );
});

Deno.test('Split lines - Single chunk without newline emitted on complete', async () => {
  assertEquals(
    await lastValueFrom(
      from(['Final chunk no newline']).pipe(splitLines(), toArray()),
    ),
    ['Final chunk no newline'],
  );
});

Deno.test('Split lines - Empty input emits empty buffer state', async () => {
  assertEquals(
    await lastValueFrom(from(['']).pipe(splitLines(), toArray())),
    [''],
  );
});
