import type { Options, Pattern } from 'fast-glob';
import fg from 'fast-glob';
import fs from 'fs-extra';

export default async function removeFiles(
  source: Pattern | Pattern[],
  options: Options = {},
) {
  const files = await fg(source, options);
  await Promise.all(files.map((file) => fs.remove(file)));
}
