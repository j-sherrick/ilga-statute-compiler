import { initILCSCrawler } from "../services/crawlers.js";
import { Chapter, Act, Topic, Subtopic } from "../models/StatuteSchemas.js";
import readline from "readline";
import connectDB from "./connectDB.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function saveActsToChapter(acts, chapter) {
    for (const act of acts) {
        const newAct = saveAct(act, chapter._id);
        chapter.acts.push(newAct._id);
    }
    await chapter.save();
}

async function saveAct(act, chapterId) {
    const newAct = new Act({
        prefix: act.prefix,
        title: act.title,
        url: act.url,
        chapter: chapterId
    });
    if (act.subtopic) {
        const subtopic = await Subtopic.findOne({ name: act.subtopic });
        if (subtopic) {
            newAct.subtopic = subtopic._id;
            subtopic.acts.push(newAct._id);
            await subtopic.save();
        } else {
            console.log(`Subtopic ${act.subtopic} not found`);
        }
    }
    await newAct.save();

    return newAct;
}

function printChapters(chapters) {
    let currentTopic ={};
    for (const chapter of chapters) {
        if (chapter.topic.name !== currentTopic.name) {
            currentTopic = chapter.topic;
            console.log(`\n\n${currentTopic.series}: ${currentTopic.name}`);
        }
        console.log(`|\n--- CHAPTER ${chapter.number} ${chapter.title}`);
    }
}

async function saveSectionsToAct(sections, act) {
    for (const section of sections) {
        const newSection = saveSection(section, act._id);
        act.sections.push(newSection._id);
    }
    await act.save();
}

async function saveSection(section, actId) {
    
}

export default {
    async run() {
        const crawler = await initILCSCrawler();
        const chapters  = crawler.chapters;
        await printChaptersWithTopics(chapters);
        rl.close();
        crawler.close();
    }    
}    