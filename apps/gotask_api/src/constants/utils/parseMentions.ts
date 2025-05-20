export const extractMentions = (comment: string): string[] => {
  const mentionPattern = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const mentions: string[] = [];
  let match;
  while ((match = mentionPattern.exec(comment)) !== null) {
    console.log("Found mention:", match[1]);  // 👈 Add this for debug
    mentions.push(match[1]);
  }
  return mentions;
};
