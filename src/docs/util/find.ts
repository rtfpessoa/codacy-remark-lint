import { Tag } from 'dox';

/* Find the first tag in `tags` with a type set to `key`. */
export function find(
  tags: ReadonlyArray<Tag>,
  key: string
): string | undefined {
  const tagOpt = tags.find(tag => {
    return tag && tag.type === key;
  });

  return tagOpt ? tagOpt.string : tagOpt;
}

/* Find the first tag in `tags` with a type set to `key`. */
export function findAll(
  tags: ReadonlyArray<Tag>,
  key: string
): ReadonlyArray<string> {
  return tags
    .filter(tag => tag && tag.string && tag.type === key)
    .map(tag => tag.string || '');
}

export default find;
