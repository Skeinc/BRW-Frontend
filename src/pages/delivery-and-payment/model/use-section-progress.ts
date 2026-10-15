import { useEffect, useState } from 'react';
import { SECTION_IDS, STEPPER_ID } from './sections';

const ACTIVATION_GAP = 24;
const INITIAL_PROGRESS: readonly number[] = SECTION_IDS.map(() => 0);

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function readProgress(): number[] {
  const isPageScrolled = window.scrollY > 0;
  const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (isPageScrolled && isAtBottom) {
    return SECTION_IDS.map(() => 1);
  }
  const stepperBottom = document.getElementById(STEPPER_ID)?.getBoundingClientRect().bottom ?? 0;
  const line = stepperBottom + ACTIVATION_GAP;
  const rects = SECTION_IDS.map((id) => document.getElementById(id)?.getBoundingClientRect());
  return rects.map((rect, index) => {
    if (!rect) {
      return 0;
    }
    const end = rects[index + 1]?.top ?? rect.bottom;
    return end > rect.top ? clamp((line - rect.top) / (end - rect.top)) : 0;
  });
}

function isSameProgress(a: readonly number[], b: readonly number[]): boolean {
  return a.every((value, index) => value === b[index]);
}

/** Per section, 0 to 1: how far the page has been scrolled through it, measured from the bottom of the sticky stepper. */
export function useSectionProgress(): readonly number[] {
  const [progress, setProgress] = useState(INITIAL_PROGRESS);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = readProgress();
        setProgress((previous) => (isSameProgress(previous, next) ? previous : next));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}
