import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { getILCSIndexString, UL_CHILDREN} from './extractors.js';
import { parseChapterIndex, parseActsToArray } from './parsers.js';


class ILCSCrawler {
    static BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';
    constructor(browser, chapters) {
        this._browser = browser;
        this._chapters = chapters;
    }

    get chapters() {
        const chaptersCopy = [];
        for (const chapter of this._chapters) {
            chaptersCopy.push({...chapter});
        }
        return chaptersCopy;
    }

    async gotoWithDelay(url, delay = 300) {
        const page = await this._browser.newPage();
        await new Promise(resolve => setTimeout(resolve, delay));
        await page.goto(url);
        return page;
    }

    async getActsFromChapter(chapter) {
        const actsPage = await this.gotoWithDelay(chapter.url);
        const actIndexString = await actsPage.$$eval(UL_CHILDREN, getILCSIndexString);
        actsPage.close();
        chapter.acts = parseActsToArray(actIndexString);
        return chapter.acts;
    }

    async close() {
        await this._browser.close();
    }
}

async function getChapterIndex(ilcsBasePage) {
    ilcsBasePage = await ilcsBasePage.$$eval(UL_CHILDREN, getILCSIndexString);
    return parseChapterIndex(ilcsBasePage);
}

export async function initILCSCrawler() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(ILCSCrawler.BASE_URL);
    const chapters = await getChapterIndex(page);
    return new ILCSCrawler(browser, chapters);
}

export default ILCSCrawler;