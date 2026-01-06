import { useEffect, useState } from "react";

export function useDebounceValue<T>(input: {
  inputValue: T;
  delayInMillis?: number;
}) {
  const { delayInMillis = 350, inputValue } = input;
  const [debouncedValue, setDebouncedValue] = useState<T>(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delayInMillis);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delayInMillis]);

  return debouncedValue;
}
