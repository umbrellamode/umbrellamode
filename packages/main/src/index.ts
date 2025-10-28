export { Actor } from "./actor";
export {
  type BaseActorActionsArgs,
  type ActorClickActionsArgs,
  type ActorTypeActionsArgs,
  type ActorClearActionsArgs,
  type ActorWaitForElementActionsArgs,
  type ActorScrollToActionsArgs,
  type ActorScrollToElementActionsArgs,
  type ActorScrollToElementTopActionsArgs,
  type ActorScrollToElementBottomActionsArgs,
  type ActorScrollByActionsArgs,
  type ActorScrollPageDownActionsArgs,
  type ActorScrollPageUpActionsArgs,
  type ActorFocusActionsArgs,
  type ActorBlurActionsArgs,
  type ActorTypeFastActionsArgs,
  type ActorIsElementInViewportActionsArgs,
  type ActorGetScrollPositionActionsArgs,
  type ActorHighlightActionsArgs,
} from "./types/actor.types";

export { type DirectorConfig } from "./types/director.types";
export {
  type UserAction,
  type ClickActionData,
  type InputActionData,
  type FormSubmitActionData,
  type SelectChangeActionData,
  type ScrollActionData,
  type NetworkRequestActionData,
  type HoverActionData,
  type BaseElementInfo,
  type ViewportInfo,
} from "./types";
export { Director } from "./director/director";
export { Widget } from "./widget/widget";
export {
  trackButtonClick,
  isClickableElement,
} from "./utils/track-button-click";
export {
  hashValue,
  hashFormData,
  shouldExcludeField,
  sanitizeUrl,
} from "./utils/hash-value";
export {
  trackInputCompletion,
  handleInputEvent,
  handleBlurEvent,
  cleanupInputTracking,
  isTextInputElement,
} from "./utils/track-input";
export { trackFormSubmission, isFormElement } from "./utils/track-form";
export { trackSelectChange, isSelectElement } from "./utils/track-select";
export {
  trackScrollEvent,
  createThrottledScrollHandler,
  resetScrollTracking,
} from "./utils/track-scroll";
export {
  interceptFetch,
  interceptXHR,
  restoreNetworkInterceptors,
} from "./utils/track-network";
export {
  handleMouseEnter,
  handleMouseLeave,
  cleanupHoverTracking,
  isHoverableElement,
} from "./utils/track-hover";
