import puppeteer, { Page } from 'puppeteer';

/**
 * @param { Element } el child element of the <ul> of chapters located at BASE_URL
 * 
 * @returns an object representing a major topic's 100 series and name in the format { series: '00', topic: 'GOVERNMENT' }
 *          or null if the text does not contain a major topic
 */
function elementHasTopic(el) {
    for (const topic in MAJOR_TOPICS) {
        if (el.innerText.includes(MAJOR_TOPICS[topic])) {
            return {
                series: topic,
                topic: MAJOR_TOPICS[topic]
            };
        }
    }

    return null;
}

/**
 * @param { Element } el assumed to be a child of the element returned by running querySelector('td ul') on BASE_URL
 * 
 * @returns chapter metadata object with the shape { chapterNumber, chapterName, chapterURL }
 *          null if `el.innerText` does not contain a chapter number
 *          null if `el.innerText` was null to begin with
*/
function elementHasChapter(el) {
    const chapterNumberRegEx = /d{1,3}/; // we should be safe assuming any sequence of 1-3 digits is a chapter number
    const chapterNumber = el.innerText.match(chapterNumberRegEx)[0];
    if (chapterNumber) {
        const chapterURL = el.querySelector('a').href;
        const chapterName = el.innerText.replace( ('CHAPTER ' + chapterNumber), '').trim();
        
        return { chapterNumber, chapterName, chapterURL };
    }

    return null;
}


/**
 * @param { HTMLUListElement } el the Element returned from running querySelector('td ul') on BASE_URL. Assumed to
 *                       at least not be null. Makes no assumptions about whether the child element is in a <li> or not.
 *                       It only cares that the innerText of `el
 * 
 * @returns { Boolean } true if `el` contains all of the ILCS major topics, false otherwise
*/
function hasAllMajorTopics(el) {
    const elInnerText = el.innerText;
    for (const topic in MAJOR_TOPICS) {
        if (!elInnerText.includes(MAJOR_TOPICS[topic])) {
            return false;
        }
    }
    return true;
}

/**
 * @param { Element } el contains the <ul> of chapters located at BASE_URL
 */
function getFormattedChapterIndex(el){

}

class ILCS {

    BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

    MAJOR_TOPICS = {
        '00': 'GOVERNMENT',
        '100': 'EDUCATION',
        '200': 'REGULATION',
        '300': 'HUMAN NEEDS',
        '400': 'HEALTH AND SAFETY',
        '500': 'AGRICULTURE AND CONSERVATION',
        '600': 'TRANSPORTATION',
        '700': 'RIGHTS AND REMEDIES',
        '800': 'BUSINESS AND EMPLOYMENT'
    };

    constructor() {
        this.chapterIndex = null;
    }

    async init() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(BASE_URL);

        const pageUElement = await page.$('td ul');

        let tempIndex = {};

        if (hasAllMajorTopics(pageUElement)) {
            let uElementChildren = await pageUElement.children;
        }


        await browser.close();
    }
}