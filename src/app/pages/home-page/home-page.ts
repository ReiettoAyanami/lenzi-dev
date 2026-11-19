import { Component, DOCUMENT, computed, inject, signal } from '@angular/core';

import { LenziScene, LenziSceneBackground } from '@lenzi/ui-kit/backgrounds';

/**
 * The reveal (lenzi, 2026-11-19: "la pagina e il testo devono avere lo stesso sfondo e il modo in cui si legge il
 * testo è che scrollando uno stormo di boidi ci passa dietro e rivela il testo", "solo materiale solido non
 * luminoso"): the words are the page's own colour, so they cannot be seen on it; a flock of solid blob-boids flies
 * behind the page, and where it passes under a word the word shows against it. Scrolling moves the words over the
 * flock.
 */
/** The theme's primary (--mat-sys-primary): a fleet's colour is a hex, not a variable. */
const PRIMARY = '#d5baff';

const REVEAL_SCENE: LenziScene = {
  name: 'Reveal',
  blobs: [],
  fleets: [
    { kind: 'blob-boid', material: 'solid', colour: PRIMARY, count: 60, colonies: 4, size: 24, sizeVariety: 0.5 },
    { kind: 'blob-boid', material: 'solid', colour: PRIMARY, count: 40, colonies: 3, size: 14, sizeVariety: 0.4 },
  ],
  // The pointer leaves them alone: a flock that fled the pointer would leave the words being read.
  follow: 'none',
  // Scrolling carries the flock up with the words, half as far: it lags behind them, so they pass over it.
  scroll: 0.5,
};

/** On a phone: fewer and smaller, the screen is narrow. */
const REVEAL_PHONE_SCENE: LenziScene = {
  name: 'Reveal on a phone',
  blobs: [],
  fleets: [
    { kind: 'blob-boid', material: 'solid', colour: PRIMARY, count: 24, colonies: 3, size: 18, sizeVariety: 0.5 },
    { kind: 'blob-boid', material: 'solid', colour: PRIMARY, count: 16, colonies: 2, size: 11, sizeVariety: 0.4 },
  ],
  follow: 'none',
  scroll: 0.5,
};

@Component({
  selector: 'app-home-page',
  imports: [LenziSceneBackground],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private readonly phoneQuery = inject(DOCUMENT).defaultView?.matchMedia('(max-width: 599px)');
  private readonly phone = signal(this.phoneQuery?.matches ?? false);

  /** The scene, by the window: a phone gets its own (AI notes of the scene). */
  protected readonly scene = computed(() => (this.phone() ? REVEAL_PHONE_SCENE : REVEAL_SCENE));

  constructor() {
    this.phoneQuery?.addEventListener('change', (event) => this.phone.set(event.matches));
  }
}
