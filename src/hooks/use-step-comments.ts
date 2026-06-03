"use client";

import { useState } from "react";

interface UseStepCommentsProps {
  stepId: string;
  addComment: (
    stepId: string,
    text: string
  ) => Promise<void>;
}

export function useStepComments({
  stepId,
  addComment,
}: UseStepCommentsProps) {
  const [comment, setComment] = useState("");

  const saveComment = () => {
    const text = comment.trim();

    if (!text) return;

    void addComment(stepId, text);
    setComment("");
  };

  return {
    comment,
    setComment,
    saveComment,
  };
}