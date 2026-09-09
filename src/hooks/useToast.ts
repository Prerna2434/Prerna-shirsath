import { useState, useCallback } from 'react';

export function useToast(durationMs = 3500) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), durationMs);
    },
    [durationMs]
  );

  const clearToast = useCallback(() => setToastMessage(null), []);

  return { toastMessage, showToast, clearToast };
}
