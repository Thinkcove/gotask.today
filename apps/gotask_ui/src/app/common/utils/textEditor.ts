import { User } from "@/app/(portal)/user/interfaces/userInterface";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

export const getTipTapExtensions = () => [
  StarterKit,
  Link,
  Image.configure({
    inline: false,
    allowBase64: true
  })
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

export const mapUsersToMentions = (users: User[]) => {
  return users.map((user: User) => ({
    id: user.id,
    mentionLabel: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name
  }));
};
