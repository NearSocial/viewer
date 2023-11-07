import { useCallback, useEffect, useState } from 'react';


export function useFlags() {
  const [rawFlags, setRawFlags] = useState();

  useEffect(() => {
    const flags = localStorage.getItem('flags') ? JSON.parse(localStorage.getItem('flags') || '') : {};
    setRawFlags(flags);
  }, []);

  const setFlags = useCallback((newFlags) => {
    setRawFlags((f) => {
      const updated = { ...f, ...newFlags };
      localStorage.setItem('flags', JSON.stringify(updated));

      alert('Flags have been saved.');

      // reload for changes to take effect
      location.reload();

      // may not be reachable
      return updated;
    });
  }, []);

  return [rawFlags, setFlags];
}