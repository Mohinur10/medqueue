import crypto from 'crypto';

export const generateSlug = (text: string): string => {
  const base = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  const randomString = crypto.randomBytes(4).toString('hex');
  return `${base}-${randomString}`;
};
