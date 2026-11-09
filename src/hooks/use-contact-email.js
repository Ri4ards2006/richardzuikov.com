import { useEffect, useState } from 'react';

export function useContactEmail() {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  // Assembled at runtime so the address is not in the static markup.
  useEffect(() => {
    setEmail(`contact@${'richardzuikov.com'}`);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return { email, copied, copy };
}
