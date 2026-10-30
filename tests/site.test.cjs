const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
const html = read("index.html");
const css = read("assets/styles.css");
const js = read("assets/app.js");

test("homepage identity and domain are Franks24, not Dispatch", () => {
  assert.match(html, /<title>Franks24/);
  assert.match(html, /https:\/\/www\.franks24\.com\//);
  assert.match(html, /Dispatch is a Franks24 service/);
  assert.match(html, /https:\/\/dispatch\.franks24\.com\//);
  assert.match(read("CNAME").trim(), /^www\.franks24\.com$/);
});

test("site contains accessible navigation and genuine interactive controls", () => {
  for (const name of ['id="main"', 'aria-label="Main navigation"', 'id="menu-toggle"', 'aria-expanded="false"', 'id="demo-play"', 'id="demo-reset"', 'role="progressbar"', 'role="tablist"', 'role="tabpanel"', 'id="faq"']) {
    assert.ok(html.includes(name), "Missing accessible element " + name);
  }
  for (const method of ["IntersectionObserver", "visibilitychange", "ArrowRight", "ArrowLeft", "Escape", "reducedMotion", "setAttribute"]) {
    assert.ok(js.includes(method), "Missing interaction " + method);
  }
});

test("UI is responsive, keyboard friendly and motion respectful", () => {
  assert.match(html, /name="viewport"/);
  assert.match(css, /@media\(max-width:820px\)/);
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(html, /class="skip-link"/);
});

test("homepage uses no fake sign-in flow or client-side secrets", () => {
  assert.doesNotMatch(js, /apiKey\s*[:=]|private_key|firebaseConfig/);
  assert.doesNotMatch(html, /<form\b/i);
  assert.match(html, /GUIDED PREVIEW · NOT LIVE DATA/);
  assert.match(html, /Authentication availability depends on its Firebase deployment configuration/);
});

test("local assets and external links use explicit safe targets", () => {
  for (const file of ["assets/styles.css", "assets/app.js", "assets/favicon.svg", ".nojekyll"]) {
    assert.ok(fs.existsSync(path.join(__dirname, "..", file)), "Missing site asset: " + file);
  }
  assert.doesNotMatch(html, /target="_blank"(?!\s+rel="noopener noreferrer")/);
  assert.match(html, /meta name="description"/);
});
