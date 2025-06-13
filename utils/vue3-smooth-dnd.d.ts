/* eslint-disable */

declare module "vue3-smooth-dnd" {
  export * from "smooth-dnd";

  export const Container: import("vue").DefineComponent<
    {
      orientation?: string;
      removeOnDropOut?: boolean;
      autoScrollEnabled?: boolean;
      animationDuration?: number;
      behaviour?: string;
      groupName?: string;
      dragHandleSelector?: string;
      nonDragAreaSelector?: string;
      lockAxis?: string;
      dragClass?: string;
      dropClass?: string;
      dragBeginDelay?: number;
      getChildPayload?: Function;
      shouldAnimateDrop?: Function;
      shouldAcceptDrop?: Function;
      getGhostParent?: Function;
      dropPlaceholder?: any;
      tag?: string;
    },
    {},
    any,
    {},
    {},
    {},
    {},
    {
      drop?: Function;
      "drag-start"?: Function;
      "drag-end"?: Function;
      "drag-enter"?: Function;
      "drag-leave"?: Function;
      "drop-ready"?: Function;
    }
  >;
  export const Draggable: import("vue").DefineComponent<
    { tag?: string },
    {},
    any
  >;
}
