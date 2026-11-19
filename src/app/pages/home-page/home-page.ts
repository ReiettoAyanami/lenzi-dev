import { Component, DOCUMENT, computed, inject, signal } from '@angular/core';

import { LenziGather, LenziLit, LenziScene, LenziSceneBackground, LenziSolidText } from '@lenzi/ui-kit/backgrounds';

/**
 * The reveal (lenzi, 2026-11-19: "la pagina e il testo devono avere lo stesso sfondo e il modo in cui si legge il
 * testo è che scrollando uno stormo di boidi ci passa dietro e rivela il testo", "solo materiale solido non
 * luminoso", then "rendi i boidi luminescenti"): the words are the page's own colour, so they cannot be seen on it; a
 * flock of glowing blob-boids flies behind the page, and where it passes under a word the word shows as a dark, solid
 * shape against the glow (lenziSolidText). Each block of words is a glass window over the flock (lenzi, 19/11: "dietro
 * al testo metti delle finestre di vetro": lenziLit), the glow blurred through it. The flock stays under the block of
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
    { kind: 'blob-boid', material: 'lamp', colour: PRIMARY, count: 220, colonies: 4, size: 11, sizeVariety: 0.4 },
    { kind: 'blob-boid', material: 'lamp', colour: PRIMARY, count: 160, colonies: 4, size: 7, sizeVariety: 0.4 },
  ],
  // The pointer leaves them alone: a flock that fled the pointer would leave the words being read.
  follow: 'none',
  // They live on the page, not on the window (lenzi, 19/11: "La posizione dei boidi non deve ignorare la pagina").
  space: 'page',
};

/** On a phone: fewer and smaller, the screen is narrow. */
const REVEAL_PHONE_SCENE: LenziScene = {
  name: 'Reveal on a phone',
  blobs: [],
  fleets: [
    { kind: 'blob-boid', material: 'lamp', colour: PRIMARY, count: 110, colonies: 4, size: 9, sizeVariety: 0.4 },
    { kind: 'blob-boid', material: 'lamp', colour: PRIMARY, count: 70, colonies: 4, size: 6, sizeVariety: 0.4 },
  ],
  follow: 'none',
  space: 'page',
};

@Component({
  selector: 'app-home-page',
  imports: [LenziGather, LenziLit, LenziSceneBackground, LenziSolidText],
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
