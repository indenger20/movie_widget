export const useScrollTop = (ref: React.RefObject<HTMLDivElement>) => {
  return (position: number) => {
    if (ref.current) {
      const div = ref.current.getElementsByClassName(
        'infinite-scroll-component',
      )[0];
      div.scrollTop = position;
    }
  };
};
