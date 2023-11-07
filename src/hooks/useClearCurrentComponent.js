import { useEffect } from 'react';

import { useCurrentComponentStore } from '../stores/current-component';

export function useClearCurrentComponent() {
  const setComponentSrc = useCurrentComponentStore((store) => store.setSrc);

  useEffect(() => {
    setComponentSrc(null);
  }, [setComponentSrc]);
}