// constants/editorMenuConstants.ts
export const textColorSwatches = [
  { value: "#000000", label: "Black" },
  { value: "#ffffff", label: "White" },
  { value: "#888888", label: "Grey" },
  { value: "#ff0000", label: "Red" },
  { value: "#ff9900", label: "Orange" },
  { value: "#ffff00", label: "Yellow" },
  { value: "#00d000", label: "Green" },
  { value: "#0000ff", label: "Blue" }
];

export const highlightColorSwatches = [
  { value: "#595959", label: "Dark grey" },
  { value: "#dddddd", label: "Light grey" },
  { value: "#ffa6a6", label: "Light red" },
  { value: "#ffd699", label: "Light orange" },
  { value: "#ffff00", label: "Yellow" },
  { value: "#99cc99", label: "Light green" },
  { value: "#90c6ff", label: "Light blue" },
  { value: "#8085e9", label: "Light purple" }
];

export const handleImageUpload = async (files: File[]): Promise<{ src: string; alt: string }[]> => {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<{ src: string; alt: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              src: reader.result as string,
              alt: file.name
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
};
