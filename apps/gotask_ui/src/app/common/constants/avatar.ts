export const colors = [
  "#FF009E",
  "#AA47BC",
  "#7A1FA2",
  "#78909C",
  "#465A65",
  "#C2175B",
  "#5C6BC0",
  "#0288D1",
  "#00579C",
  "#0098A6",
  "#00887A",
  "#004C3F",
  "#689F39",
  "#33691E",
  "#8C6E63",
  "#5D4038",
  "#7E57C2",
  "#512DA7",
  "#EF6C00",
  "#F5511E",
  "#BF360C",
  "#F5878C",
  "#A2B01F",
  "#709CBE",
  "#407887",
  "#0087BF"
];

export const getColorForUser = (userId: string) => {
  const hash = [...userId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
