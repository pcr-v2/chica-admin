"use client";

import { useEffect, useState } from "react";

export default function useInView<T extends Element>(rootMargin = "200px") {
  const [node, setNode] = useState<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (isInView || node == null) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isInView, node, rootMargin]);

  return [setNode, isInView] as const;
}
