/* Progressive enhancement: page content and navigation also work without JS. */
"use strict";

document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
if (menuButton && navigation) {
  function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
  }
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Close" : "Menu";
  });
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });
}

const filterContainer = document.querySelector(".filters");
if (filterContainer) {
  filterContainer.hidden = false;
  const buttons = filterContainer.querySelectorAll("[data-filter]");
  const projects = document.querySelectorAll("[data-category]");
  const status = document.querySelector("#filter-status");
  buttons.forEach(button => button.addEventListener("click", () => {
    const choice = button.dataset.filter;
    buttons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    let count = 0;
    projects.forEach(project => {
      const show = choice === "all" || project.dataset.category.split(" ").includes(choice);
      project.hidden = !show;
      if (show) count += 1;
    });
    if (status) status.textContent = `${count} project${count === 1 ? "" : "s"} shown.`;
  }));
}

document.querySelectorAll("[data-copy-target]").forEach(button => {
  button.hidden = false;
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    const status = button.parentElement.querySelector(".copy-status");
    if (!target || !status) return;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(target.textContent.trim());
      status.textContent = "Copied. Paste this into your terminal.";
    } catch (_) {
      // Browsers can deny clipboard access on file:// or when permission is absent.
      status.textContent = "Select and copy the command above manually.";
    }
  });
});
