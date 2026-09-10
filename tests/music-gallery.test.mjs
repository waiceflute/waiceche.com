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
const teachingPhilosophy = content.pages.music.sections.find((section) => section.title === "Teaching Philosophy");
const competitionHighlights = content.pages.students.sections.find((section) => section.title === "Competition Highlights");
const miaIeongSubtitle = "Mia Ieong won Second Prize at the IX International Liszt Ferenc Final Round Competition 2026 (Hungary Eger)";

assert.equal(content.images.musicFunLogo.caption, "Music Fun 100");
assert.ok(fs.existsSync(path.join(projectDir, content.images.musicFunLogo.src.replace("./", ""))));
assert.match(appSource, /class="cta-logo"/);
assert.match(appSource, /musicFunLogo/);

assert.equal(gallery.title, "Music Performance Photos");
assert.equal(gallery.items.length, 3);
assert.equal(content.pages.home.highlights[1].label, studentRegions);
assert.equal(content.translations.zhHant[studentRegions], "學生來自加拿大、美國、澳洲、新西蘭、泰國、新加坡、意大利、英國、日本、中國、香港、澳門等地");
assert.equal(content.translations.zhHans[studentRegions], "学生来自加拿大、美国、澳大利亚、新西兰、泰国、新加坡、意大利、英国、日本、中国、香港、澳门等地");
assert.equal(teachingPhilosophy.imageKey, "teachingPhilosophyStudents");
assert.equal(content.images.teachingPhilosophyStudents.caption, "Teaching Philosophy");
assert.ok(fs.existsSync(path.join(projectDir, content.images.teachingPhilosophyStudents.src.replace("./", ""))));
assert.equal(competitionHighlights.body, miaIeongSubtitle);
assert.equal(competitionHighlights.imageKey, "miaIeongLisztSecondPrize2026");
assert.equal(content.images.miaIeongLisztSecondPrize2026.caption, miaIeongSubtitle);
assert.ok(fs.existsSync(path.join(projectDir, content.images.miaIeongLisztSecondPrize2026.src.replace("./", ""))));
assert.equal(content.images.cleanEnergyForumFamilyBusiness.ratio, "2:3");
assert.equal(content.images.cleanEnergyForumIndustryDelegates.ratio, "3:2");
assert.equal(content.pages.leadership.galleries[1].className, "clean-energy-gallery");
assert.equal(content.images.macauFashionWeekCatwalkShow.caption, "Macau Fashion Week Catwalk Show");
assert.ok(fs.existsSync(path.join(projectDir, content.images.macauFashionWeekCatwalkShow.src.replace("./", ""))));
assert.ok(content.pages.leadership.galleries.some((gallery) => gallery.items.includes("macauFashionWeekCatwalkShow")));
assert.ok(content.pages.leadership.groups[0].items.includes("Music video lead actress"));
assert.match(content.pages.leadership.galleries[0].intro, /She also won Third Prize/);
assert.equal(content.images.shanghaiMeituanExchange.caption, "Shanghai Business Exchange with the Vice President of Meituan Waimai");
assert.equal(content.images.shanghaiYouthElitesDelegation.caption, "Macau Youth Elites Association Shanghai Exchange Delegation");
assert.ok(fs.existsSync(path.join(projectDir, content.images.shanghaiMeituanExchange.src.replace("./", ""))));
assert.ok(fs.existsSync(path.join(projectDir, content.images.shanghaiYouthElitesDelegation.src.replace("./", ""))));
assert.ok(content.pages.leadership.galleries.some((gallery) => gallery.items.includes("shanghaiMeituanExchange")));
assert.ok(content.pages.leadership.groups[2].items.includes("Shanghai business exchange delegation with Meituan Waimai, Ximalaya and Bihu Group"));
const singingJudgingItem = "Judge for singing and music competitions at St. Joseph's School, Hoi San School and the Global Overseas Chinese Water Cube Singing & Music Competition";
assert.ok(content.pages.leadership.groups[2].items.includes(singingJudgingItem));
assert.equal(content.pages.leadership.galleries.at(-1).title, "Singing & Music Competition Judging");
assert.deepEqual([...content.pages.leadership.galleries.at(-1).items], ["singingMusicCompetitionJudgingPanel", "singingMusicCompetitionAward", "singingMusicCompetitionSchoolPerformance"]);
for (const imageKey of ["singingMusicCompetitionJudgingPanel", "singingMusicCompetitionAward", "singingMusicCompetitionSchoolPerformance"]) {
  assert.equal(content.images[imageKey].status, "public");
  assert.ok(fs.existsSync(path.join(projectDir, content.images[imageKey].src.replace("./", ""))));
}
const fluteTeaching = content.pages.music.sections.find((section) => section.title === "Flute Teaching Experience");
assert.equal(fluteTeaching.items.length, 7);
assert.equal(fluteTeaching.items[0].period, "2004–2005");
assert.equal(fluteTeaching.items[6].period, "2011–2013");
const youthMusicAchievements = content.pages.music.sections.find((section) => section.title === "Personal Macau Youth Music Achievements");
assert.equal(youthMusicAchievements.items.length, 8);
assert.equal(youthMusicAchievements.items[6].period, "2006 (24th)");
assert.equal(content.pages.students.sections[1].title, "Student Individual Honour");
assert.equal(content.pages.students.sections[1].imageKey, "lisztMacauFluteFirstPrize");
assert.match(content.pages.students.sections[1].body, /Mia Ieong won First Prize in flute/);
assert.ok(fs.existsSync(path.join(projectDir, content.images.lisztMacauFluteFirstPrize.src.replace("./", ""))));

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
const sectionHeaderBody = appSource.match(/function sectionHeader\(title, intro\) \{([\s\S]*?)\n\}/)?.[1] || "";
assert.doesNotMatch(sectionHeaderBody, /page\.gallery/);
assert.match(appSource, /window\.addEventListener\("hashchange", \(\) => renderPage\(currentRoute\(\)\)\)/);
