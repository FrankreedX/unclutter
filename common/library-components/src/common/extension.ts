// browser is not defined in server-side next.js code
export function getBrowser(): any {
    // @ts-ignore
    return typeof browser !== "undefined" ? browser : chrome;
}
type BrowserType = "chromium" | "firefox";
export function getBrowserType(): BrowserType {
    // @ts-ignore
    if (typeof browser !== "undefined") {
        return "firefox";
    } else {
        return "chromium";
    }
}
export function getBrowserTypeWeb(): BrowserType {
    // normal getBrowserType() stopped working on web?
    // navigator.userAgentData only available in chrome & edge :(
    try {
        const isChrome =
            // @ts-ignore
            navigator.userAgentData?.brands.map((b) => b.brand).includes("Chromium") || false;
        return isChrome ? "chromium" : "firefox";
    } catch {
        return "chromium";
    }
}

export function getUnclutterExtensionId(): string {
    return getBrowserType() === "chromium"
        ? "ibckhpijbdmdobhhhodkceffdngnglpk"
        : "{8f8c4c52-216c-4c6f-aae0-c214a870d9d9}";
}
export function getNewTabExtensionId(): string {
    return getBrowserType() === "chromium"
        ? "bghgkooimeljolohebojceacblokenjn"
        : "{bb10288b-838a-4429-be0a-5268ee1560b8}";
}

// send a message to the Unclutter or Unclutter library extension
// can't always return a response
export function sendMessage(message: object, toLibrary: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            // preferrable send message to extension directly (https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage)
            // this is the only way to send data from extension to extension
            getBrowser().runtime.sendMessage(
                toLibrary ? getNewTabExtensionId() : getUnclutterExtensionId(),
                message,
                resolve
            );
        } catch (err) {
            // content script fallback
            window.postMessage(message, "*");
            // work around naming inconsistency in Unclutter 0.18.1
            window.postMessage(
                // @ts-ignore
                { ...message, type: message.event, event: null },
                "*"
            );
            resolve(undefined);
        }
    });
}

export function openArticleResilient(url: string, newTab: boolean = true, annotationId?: string) {
    sendMessage({
        event: "openLinkWithUnclutter",
        url,
        newTab,
        annotationId,
    });
}

export function setUnclutterLibraryAuth(userId: string) {
    const message = {
        event: "setLibraryAuth",
        userId,
        webJwt: document.cookie, // requires disabled httpOnly flag, set via patch-package
    };

    // send to both extensions
    sendMessage(message);
    sendMessage(message, true);
}
