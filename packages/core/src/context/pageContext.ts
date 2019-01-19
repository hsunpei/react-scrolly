import { createContext } from 'react';
import { Observable } from 'rxjs';

export type descriptionID = string | null;

interface PageContextInterface {
  activeDescriptionId: descriptionID;
  scrollObserver: Observable<Event>;
  setCurrentActiveId: ((activeDescriptionId: descriptionID) => void);
}

export default createContext<PageContextInterface | null>(null);
