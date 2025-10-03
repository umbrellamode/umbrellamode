export const captureDocumentContext = (): Document => {
  if (!window) {
    throw new Error(
      "Window and document not found. Please ensure the page is loaded."
    );
  }

  const rawHtml = window?.document?.documentElement?.outerHTML;

  // we need to parse the html string into a DOM object
  const parser = new DOMParser();
  const document = parser.parseFromString(rawHtml, "text/html");

  return document;
};
