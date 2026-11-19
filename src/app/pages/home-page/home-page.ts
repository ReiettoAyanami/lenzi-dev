import { Component, DOCUMENT, computed, inject, signal } from '@angular/core';

import { LenziGather, LenziScene, LenziSceneBackground } from '@lenzi/ui-kit/backgrounds';

/**
 * The reveal (lenzi, 2026-11-19: "la pagina e il testo devono avere lo stesso sfondo e il modo in cui si legge il
 * testo è che scrollando uno stormo di boidi ci passa dietro e rivela il testo", "solo materiale solido non
 * luminoso"): the words are the page's own colour, so they cannot be seen on it; a flock of solid blob-boids flies
 * behind the page, and where it passes under a word the word shows against it. The flock stays under the block of
 * text the window shows most of, all of it, and hurries to the next one when the page scrolls there (lenzi, 19/11:
 * "i boidi devono rimanere sulla zona di testo e spostarsi al prossimo scroll velocemente verso la nuova zona di
 * testo"): each block is a `lenziGather` zone.
 */
/** The theme's primary (--mat-sys-primary): a fleet's colour is a hex, not a variable. */
const PRIMARY = '#d5baff';

/** Small and many (lenzi, 19/11: "Rendili più piccoli e più frequenti"), so they melt into one cover under every line. */
const REVEAL_SCENE: LenziScene = {
  name: 'Reveal',
  blobs: [],
  fleets: [
    { kind: 'blob-boid', material: 'solid', colour: PRIMARY, count: 170, colonies: 4, size: 15, sizeVariety: 0.4 },
    { kind: 'blob-boid', material: 'solid', colour: PRIMARY, count: 110, colonies: 4, size: 10, sizeVariety: 0.4 },
  ],
  // The pointer leaves them alone: a flock that fled the pointer would leave the words being read.
  follow: 'none',
};

/** On a phone: fewer and smaller, the screen is narrow. */
const REVEAL_PHONE_SCENE: LenziScene = {
  name: 'Reveal on a phone',
  blobs: [],
  fleets: [
    { kind: 'blob-boid', material: 'solid', colour: PRIMARY, count: 90, colonies: 4, size: 12, sizeVariety: 0.4 },
    { kind: 'blob-boid', material: 'solid', colour: PRIMARY, count: 60, colonies: 4, size: 8, sizeVariety: 0.4 },
  ],
  follow: 'none',
};

@Component({
  selector: 'app-home-page',
  imports: [LenziGather, LenziSceneBackground],
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
