// Tento súbor NESMIE rozhodovať.
// Len tlmí, oneskoruje, rozkladá.

document.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", e => {
    // mikro oneskorenie → kognitívna pauza
    e.preventDefault();
    const href = a.getAttribute("href");
    setTimeout(() => window.location.href = href, 180);
  });
});
