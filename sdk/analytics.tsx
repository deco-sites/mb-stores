import { IS_BROWSER } from "$fresh/runtime.ts";
import type { AnalyticsEvent } from "deco-sites/std/commerce/types.ts";

declare global {
  interface Window {
    DECO_SITES_STD: {
      sendAnalyticsEvent: (args: AnalyticsEvent) => void;
    };
  }
}

export const sendEvent = <E extends AnalyticsEvent>(event: E) => {
  try {
    window.DECO_SITES_STD.sendAnalyticsEvent(event);
  } catch (error) {
    console.log("Failed while sending event with error", event, error);
  }
};

/**
 * This function is usefull for sending events on click. Works with both Server and Islands components
 */
export const sendEventOnClick = <E extends AnalyticsEvent>(event: E) => ({
  onclick: IS_BROWSER
    ? () => sendEvent(event)
    : `(${sendEvent})(${JSON.stringify(event)})`,
});

/**
 * This componente should be used when want to send event for rendered componentes.
 * This behavior is usefull for view_* events.
 */
export const SendEventOnLoad = <E extends AnalyticsEvent>(
  { event }: { event: E },
) => (
  <script
    dangerouslySetInnerHTML={{
      __html: `addEventListener("load", () => (${sendEvent})(${
        JSON.stringify(event)
      }))`,
    }}
  />
);
