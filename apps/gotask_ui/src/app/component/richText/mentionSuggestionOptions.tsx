import type { MentionOptions } from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import SuggestionList, { SuggestionListRef } from "./SuggestionList";

export type MentionSuggestion = {
  id: string;
  mentionLabel: string;
};

const DOM_RECT_FALLBACK: DOMRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON() {
    return {};
  }
};

export function createMentionSuggestionOptions(
  userList: MentionSuggestion[]
): MentionOptions["suggestion"] {
  return {
    items: async ({ query }) =>
      userList
        .filter((item) => item.mentionLabel.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5),

    render: () => {
      let component: ReactRenderer<SuggestionListRef> | undefined;
      let popup: TippyInstance | undefined;

      return {
        onStart: (props) => {
          component = new ReactRenderer(SuggestionList, {
            props,
            editor: props.editor
          });

          popup = tippy("body", {
            getReferenceClientRect: () => props.clientRect?.() ?? DOM_RECT_FALLBACK,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start"
          })[0];
        },

        onUpdate(props) {
          component?.updateProps(props);
          popup?.setProps({
            getReferenceClientRect: () => props.clientRect?.() ?? DOM_RECT_FALLBACK
          });
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            popup?.hide();
            return true;
          }
          if (!component?.ref) return false;
          return component.ref.onKeyDown(props);
        },

        onExit() {
          popup?.destroy();
          component?.destroy();
          popup = undefined;
          component = undefined;
        }
      };
    }
  };
}
