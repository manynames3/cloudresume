/* Native dialog is optional; original-image links remain usable without JS. */
(() => {
  for (const trigger of document.querySelectorAll("[data-diagram-open]")) {
    const dialog = document.getElementById(trigger.dataset.diagramOpen);
    if (!dialog || typeof dialog.showModal !== "function") continue;
    trigger.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      dialog.showModal();
      const viewport = dialog.querySelector(".architecture-viewer__viewport");
      const image = viewport.querySelector("img");
      let scale;
      const fit = () => Math.min(1, viewport.clientWidth / Number(image.getAttribute("width")), viewport.clientHeight / Number(image.getAttribute("height")));
      const update = (value) => {
        scale = Math.max(fit(), Math.min(2, value));
        image.style.width = Number(image.getAttribute("width")) * scale + "px";
        for (const button of dialog.querySelectorAll("[data-diagram-zoom]")) {
          button.disabled = button.dataset.diagramZoom === "out" ? scale <= fit() : button.dataset.diagramZoom === "in" ? scale >= 2 : false;
        }
      };
      update(fit());
      viewport.scrollTo(0, 0);
      const onZoom = (zoomEvent) => {
        const button = zoomEvent.target.closest("[data-diagram-zoom]");
        if (!button) return;
        update(button.dataset.diagramZoom === "fit" ? fit() : scale * (button.dataset.diagramZoom === "in" ? 1.4 : 1 / 1.4));
        if (button.dataset.diagramZoom === "fit") viewport.scrollTo(0, 0);
      };
      const onResize = () => update(Math.max(fit(), scale));
      const close = () => {
        dialog.removeEventListener("click", onZoom);
        window.removeEventListener("resize", onResize);
        trigger.focus({ preventScroll: true });
      };
      dialog.addEventListener("click", onZoom);
      dialog.addEventListener("close", close, { once: true });
      window.addEventListener("resize", onResize);
    });
  }
})();
