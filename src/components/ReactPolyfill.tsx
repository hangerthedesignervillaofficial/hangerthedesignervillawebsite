"use client";

import * as ReactDOM from "react-dom";

if (typeof window !== "undefined") {
  const rd = ReactDOM as any;
  if (!rd.findDOMNode) {
    rd.findDOMNode = function (componentOrElement: any) {
      if (componentOrElement == null) return null;
      if (componentOrElement instanceof Element) return componentOrElement;
      return (
        componentOrElement._reactInternals?.stateNode ||
        componentOrElement._reactInternalFiber?.stateNode ||
        null
      );
    };
  }
}

export function ReactPolyfill() {
  return null;
}
