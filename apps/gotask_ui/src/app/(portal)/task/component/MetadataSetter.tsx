// components/MetadataSetter.tsx
"use client";
import { useEffect } from "react";

export default function MetadataSetter({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      const descTag = document.querySelector("meta[name='description']");
      if (descTag) {
        descTag.setAttribute("content", description);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.name = "description";
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }
    }
  }, [title, description]);

  return null;
}
