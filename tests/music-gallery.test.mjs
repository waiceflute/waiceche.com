import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const projectDir = path.resolve(import.meta.dirname, "..");
const contentSource = fs.readFileSync(path.join(projectDir, "content.js"), "utf8");
const appSource = fs.readFileSync(path.join(projectDir, "app.js"), "utf8");

const sandbox = { window: {} };
vm.runInNewContext(contentSource, sandbox);

const content = sandbox.window.WAICE_SITE_CONTENT;
const gallery = content.pages.music.gallery;
const studentRegions = "Students from Canada, United States, Australia, New Zealand, Thailand, Singapore, Italy, UK, Japan, China, Hong Kong, Macau, and more.";

assert.equal(gallery.title, "Music Performance Photos");
assert.equal(gallery.items.length, 3);
assert.equal(content.pages.home.highlights[1].label, studentRegions);
assert.equal(content.translations.zhHant[studentRegions], "學生來自加拿大、美國、澳洲、新西蘭、泰國、新加坡、意大利、英國、日本、中國、香港、澳門等地");
assert.equal(content.translations.zhHans[studentRegions], "学生来自加拿大、美国、澳大利亚、新西兰、泰国、新加坡、意大利、英国、日本、中国、香港、澳门等地");

const expected = [
  ["mozartConcertMacauCulturalCentre", "Concert of the Night of Mozart at Macau Cultural Centre"],
  ["paulEdmundDaviesMasterClass", "Master Class of Paul Edmund-Davies"],
  ["trevorWyeMasterClass", "Master Class of Trevor Wye"],
];

for (const [imageKey, caption] of expected) {
  assert.equal(content.images[imageKey].caption, caption);
  assert.equal(content.images[imageKey].status, "public");
  assert.ok(fs.existsSync(path.join(projectDir, content.images[imageKey].src.replace("./", ""))));
  assert.ok(gallery.items.includes(imageKey));
}

assert.match(appSource, /function renderImageGallery/);
assert.match(appSource, /page\.gallery/);
