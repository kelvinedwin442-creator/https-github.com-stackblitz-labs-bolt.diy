import React from 'react';
import { KitLang } from '../i18n/kit';
import { MarkingSize } from '../types/tactics';

/**
 * Coach Kit device settings. Kept in localStorage so it survives a reload on the phone
 * that is doing double duty as the whole coaching office.
 */
export interface KitSettings {
  lang: KitLang;
  /** big markings + big type so a huddle of kids can read one phone */
  huddleMode: boolean;
  /** optional, only used as a footer on shared cards */
  academyName: string;
  showPidginCues: boolean;
}

const SETTINGS_KEY = 'coachkit_settings_v1';

const DEFAULTS: KitSettings = {
  lang: 'en',
  huddleMode: true,
  academyName: '',
  showPidginCues: true,
};

type Listener = (s: KitSettings) => void;
const listeners = new Set<Listener>();

let cache: KitSettings | null = null;

function read(): KitSettings {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    cache = raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<KitSettings>) } : { ...DEFAULTS };
  } catch {
    cache = { ...DEFAULTS };
  }
  return cache;
}

export function getKitSettings(): KitSettings {
  return read();
}

export function setKitSettings(patch: Partial<KitSettings>): KitSettings {
  const next = { ...read(), ...patch };
  cache = next;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    /* private mode / file:// restrictions: settings simply do not persist */
  }
  listeners.forEach((l) => l(next));
  return next;
}

export function subscribeKitSettings(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Marking size the pitch should open with for this coach. */
export function defaultMarkingSize(): MarkingSize {
  return read().huddleMode ? 'large' : 'small';
}

export function useKitSettings(): [KitSettings, (p: Partial<KitSettings>) => void] {
  const [settings, setState] = React.useState<KitSettings>(() => read());
  React.useEffect(() => subscribeKitSettings(setState), []);
  return [settings, setKitSettings];
}
