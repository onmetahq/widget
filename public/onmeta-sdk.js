class onMetaWidget {
  constructor({
    apiKey,
    chainId,
    tokenAddress,
    elementId,
    walletAddress,
    fiatAmount,
    userEmail,
    offRamp,
    onRamp,
    widgetHeight,
    minAmount,
    metamask,
  }) {
    this.apiKey = apiKey || "";
    this.elementId = elementId;
    this.walletAddress = walletAddress || "";
    this.fiatAmount = fiatAmount || "";
    this.chainId = chainId || "";
    this.tokenAddress = tokenAddress || "";
    this.isEventListnerOn = false;
    this.userEmail = userEmail || "";
    this.offRamp = offRamp || "";
    this.onRamp = onRamp || "";
    this.widgetHeight = widgetHeight || "32rem";
    this.minAmount = minAmount || "";
    this.metamask=metamask || "";
  }
  init() {
    let iframe = document.createElement("iframe");
    iframe.id = "onMetaWidgetId";
    iframe.allow = "clipboard-read; clipboard-write;camera";

    const iframeCustomStyles = {
      border: "none",
      minHeight: this.widgetHeight,
      minWidth: "100%",
      overflow: "hidden",
    };
    Object.assign(iframe.style, iframeCustomStyles); // for adding the custom styles in the iframe

    if (!this.apiKey) {
      iframe.srcdoc = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"/> <meta http-equiv="X-UA-Compatible" content="IE=edge"/> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title>Document</title> </head> <body> <div> <p>Invalid api key</p></div></body></html>`;
    } else {
      iframe.src = `https://platform.onmeta.in/?apiKey=${this.apiKey}&walletAddress=${this.walletAddress}&fiatAmount=${this.fiatAmount}&userEmail=${this.userEmail}&tokenAddress=${this.tokenAddress}&chainId=${this.chainId}&offRamp=${this.offRamp}&onRamp=${this.onRamp}&minAmount=${this.minAmount}&metamask=${this.metamask}`;
    }
    let element = document.getElementById(this.elementId);
    element.appendChild(iframe);
  }
  on(eventType, callbackFn) {
    window.addEventListener("message", function (event) {
      if (event.data.type === "onMetaHandler") {
        if (eventType === "ALL_EVENTS") {
          if (
            event.data.detail.cryptoSwap === "success" ||
            event.data.detail.cryptoSwap === "failed"
          ) {
            callbackFn?.(event.data.detail.cryptoSwap);
          }
        }
        if (
          event.data.detail.cryptoSwap === "failed" &&
          eventType === "FAILED"
        ) {
          callbackFn?.(event.data.detail.cryptoSwap);
        }
        if (
          event.data.detail.cryptoSwap === "success" &&
          eventType === "SUCCESS"
        ) {
          callbackFn?.(event.data.detail.cryptoSwap);
        }

        if (eventType === "ORDER_EVENTS") {
          if (event.data.detail.eventCategory === "order") {
            callbackFn?.(event.data.detail);
          }
        }

        if (eventType === "ORDER_COMPLETED_EVENTS") {
          if (
            event.data.detail.eventCategory === "order" &&
            (event.data.detail.cryptoSwap === "success" ||
              event.data.detail.cryptoSwap === "failed")
          ) {
            callbackFn?.(event.data.detail);
          }
        }

        if (eventType === "ACTION_EVENTS") {
          if (event.data.detail.eventCategory === "action") {
            callbackFn?.(event.data.detail);
          }
        }
      }
    });
  }
}

window.onMetaWidget = onMetaWidget;
