import { createContext } from 'react';
import { Observable } from 'rxjs';

export type sectionID = string | null;

interface ScrollPosition {
  scrollTop: number;
  scrollBottom: number;
  windowHeight: number;
}

export interface ActiveSectionInfo {
  /** `trackingId` of the active section (section closest to the bottom of the viewport) */
  id: sectionID;

  /** Ratio of the active section being scrolled  */
  ratio: number | null;
}

export interface ActiveSectionTracker {
  addActiveSection: (trackingId: string, sectionTop: number, scrollBottom: number) => void;
  removeActiveSection: (trackingId: string, scrollBottom: number) => void;
  updateScrollRatio: (trackingId: string, scrolledRatio: number) => void;
  activeSectionObs$: Observable<ActiveSectionInfo | null>;
}

export interface PageContextInterface extends ActiveSectionTracker {
  scrollObs$: Observable<ScrollPosition>;
  resizeObs$?: Observable<Event>;
}

export const PageContext = createContext<PageContextInterface | null>(null);
