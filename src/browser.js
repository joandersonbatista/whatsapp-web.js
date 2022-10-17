const puppeteer = require("puppeteer");

class SingletonBrowser {
    static instance = null;

    browser;

    constructor() {
        this.browser = puppeteer.launch({ headless: false });
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new SingletonBrowser();
        }

        return this.instance;
    }

    async newPage() {
        return (await this.browser).newPage();
    }

    async pages() {
        return (await this.browser).pages();
    }
}

module.exports = SingletonBrowser;
