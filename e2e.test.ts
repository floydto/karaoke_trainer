import puppeteer from 'puppeteer';

jest.setTimeout(20000);

// Switch url here
// const url = 'http://localhost:8080/'
const url = 'https://karaoketrainer.club'

describe('launch main page', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            // Must set to false, otherwise fail p5 related test
            headless: false,
            // Use fake device for Media Stream to replace actual camera and microphone. 
            args: ['--use-fake-device-for-media-stream']
        }),
        page = await browser.newPage()

        // Grant Media Permission to browser
        const context = await browser.defaultBrowserContext();
        await context.clearPermissionOverrides();
        await context.overridePermissions(url, ['microphone']);
    })

    afterAll(async () => {
        browser.close()
    })

    // Selection Menu
    it('show main page selection', async () => {
        await page.goto(url)
        const mainPageSelection = await page.waitForSelector('#current-mode-interface div.selection-menu', {
            visible: true,
        })

        expect(mainPageSelection).toBeDefined();
    })

    it('show at least 3 basic buttons', async () => {
        await page.goto(url)
        await page.waitForSelector('#current-mode-interface div.custom-button', {
            visible: true
        })

        const mainPageButtonsCount = await page.$$eval('#current-mode-interface div.custom-button', buttonDivs => buttonDivs.length)
        expect(mainPageButtonsCount).toBeGreaterThanOrEqual(3)
    })

    it('1st button work', async () => {
        // Arrange
            // Change button Number here
        const buttonNumber = 1;
        const buttonIndex = buttonNumber - 1;

        await page.goto(url)
        await page.waitForSelector('#current-mode-interface div.custom-button', {
            visible: true
        })

        const mainPageButtons = await page.$$('#current-mode-interface div.custom-button')
        const mainPageButtonsInnerHTML = await page.$$eval('#current-mode-interface div.custom-button', buttons => buttons.map(button => button.innerHTML));

        const checkInnerHTML = mainPageButtonsInnerHTML[buttonIndex].trim()
        
        // Act
        await mainPageButtons[buttonIndex].click()
        
        await page.waitForFunction(`document.querySelector(".curator_title").innerHTML.includes("${checkInnerHTML}")`);
        const curatorTitle = await page.waitForSelector('.curator_title')
        const resultInnerHTML = await curatorTitle.evaluate(element => {
            return element.innerHTML
        })

        // Assert
        expect(resultInnerHTML).toBe(checkInnerHTML)
    })

    it('2nd button work', async () => {
        // Arrange
            // Change button Number here
        const buttonNumber = 2;
        const buttonIndex = buttonNumber - 1;

        await page.goto(url)
        await page.waitForSelector('#current-mode-interface div.custom-button', {
            visible: true
        })

        const mainPageButtons = await page.$$('#current-mode-interface div.custom-button')
        const mainPageButtonsInnerHTML = await page.$$eval('#current-mode-interface div.custom-button', buttons => buttons.map(button => button.innerHTML));

        const checkInnerHTML = mainPageButtonsInnerHTML[buttonIndex].trim()

        // Act
        await mainPageButtons[buttonIndex].click()
        
        await page.waitForFunction(`document.querySelector(".curator_title").innerHTML.includes("${checkInnerHTML}")`);
        const curatorTitle = await page.waitForSelector('.curator_title')
        const resultInnerHTML = await curatorTitle.evaluate(element => {
            return element.innerHTML
        })

        // Assert
        expect(resultInnerHTML).toBe(checkInnerHTML)
    })

    it('3rd button work', async () => {
        // Arrange
            // Change button Number here
        const buttonNumber = 3;
        const buttonIndex = buttonNumber - 1;
        await page.goto(url)
        await page.waitForSelector('#current-mode-interface div.custom-button', {
            visible: true
        })

        const mainPageButtons = await page.$$('#current-mode-interface div.custom-button')

        // Act
        await mainPageButtons[buttonIndex].click()
        
        // Assert
            // As the title is different with selection menu, check Youtube class existence
        await page.waitForSelector('.youtube-video-wrapper', {
            visible: true,
        })
    })

    // Right Nav
    it('mic test button work', async () => {
        // Arrange
        await page.goto(url)
        const micTestButton = await page.waitForSelector('.rightNav .mic', {
            visible: true
        })

        // Act
        await micTestButton.click()
        
        // Assert
        await page.waitForSelector('.rightNav .mic canvas', {
            visible: true
        })
    })

    it('phone test button work', async () => {
        // Arrange
        await page.goto(url)
        const phoneTestButton = await page.waitForSelector('.rightNav .headphone', {
            visible: true
        })

        // Act
        await phoneTestButton.click()
        
        // Assert
        const phoneCanvas = await page.waitForSelector('.rightNav .headphone canvas', {
            visible: true
        })

        const phoneAudio = await page.waitForSelector('.rightNav .headphone audio')
        let phoneAudioPauseStatus = await phoneAudio.evaluate((element) => {
            // @ts-ignore
            return element.paused
        })

        expect(phoneAudioPauseStatus).toBe(true)
    })

    it('have sound after click phone test canvas', async () => {
        // Arrange
        await page.goto(url)
        const phoneTestButton = await page.waitForSelector('.rightNav .headphone', {
            visible: true
        })
        await phoneTestButton.click()

        const phoneCanvas = await page.waitForSelector('.rightNav .headphone canvas', {
            visible: true
        })
        const phoneAudio = await page.waitForSelector('.rightNav .headphone audio')

        // Act
        await phoneCanvas.click()
    
        // Assert              
        const phoneAudioPauseStatus = await phoneAudio.evaluate((element) => {
             // @ts-ignore
            return element.paused
        })
        expect(phoneAudioPauseStatus).toBe(false)
    })

    // Side Nav
    it('can click out Side Nav', async () => {
        // Arrange
        await page.goto(url)
        const sideNavButton = await page.waitForSelector('.burger-wrapper', {
            visible: true
        })

        // Act
        await sideNavButton.click()
    
        // Assert              
        const navBar = await page.waitForSelector('.nav', {
            visible: true
        })

        const className = await navBar.getProperty('className')
        console.log(className)
    })
})