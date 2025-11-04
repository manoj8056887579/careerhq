"use client";

import Script from "next/script";

export function ChatWidget() {
  return (
    <Script
      src="https://myappzchat.com/production/master/widget/embed-widget.umd.js"
      data-widget-id="23f3781e-8769-42ec-b2d6-d7bfd1983859"
      strategy="afterInteractive"
    />
  );
}
