const { useRef } = React;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useLatest(value) {
  const lastestRef = useRef(value);
  useEffect(() => {
    lastestRef.current = value;
  });
  return lastestRef;
}
