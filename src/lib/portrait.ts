import type { ImageMetadata } from 'astro';

/**
 * The design's <image-slot> was an empty placeholder. Drop a file at
 * src/assets/portrait.{jpg,jpeg,png,webp,avif} and it is picked up, optimised
 * and served responsively by the hero, and named as the Person's image in the
 * JSON-LD; until then the hero shows a labelled placeholder instead of an
 * empty circle, and the Person has no image.
 */
const portraits = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/portrait.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export const portrait: ImageMetadata | undefined = Object.values(portraits)[0]?.default;
