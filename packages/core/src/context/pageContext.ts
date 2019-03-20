import { createContext } from 'react';
import { Observable } from 'rxjs';

export type sectionID = string | null;

interface ScrollPosition {
  scrollTop: number;
  scrollBottom: number;
  windowHeight: number;
}

export interface ActiveSection {
  activeSectionId: sectionID;
  addActiveSection: (trackingId: string,  sectionTop: number, scrollBottom: number) => void;
  removeActiveSection: (trackingId: string, scrollBottom: number) => void;
}

export interface PageContextInterface extends ActiveSection {
  scrollObserver$: Observable<ScrollPosition>;
  resizeObserver$: Observable<Event>;
}

export const PageContext = createContext<PageContextInterface | null>(null);
