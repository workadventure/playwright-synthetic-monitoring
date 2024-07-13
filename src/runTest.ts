import {Page} from "puppeteer";
import {env} from "./EnvironmentVariable";

export async function executeTest(page: Page) {
    try {
        await page.goto(env.URL);

        // Await for the "Let's go" button to be available.
        console.log('Waiting for camera button');

        // We don't wait for button.selectCharacterSceneFormSubmit because the promise might never resolve (if the character is stored in DB)
        page.waitForSelector('button.selectCharacterSceneFormSubmit').then(async () => {
            console.log('Select character scene button found');
            // If we need to select a character, let's pick the first one.
            await page.keyboard.press('Enter');
        }).catch(() => {
            // Do nothing if the button is not found. It means that the character is already selected.
        });

        await page.waitForSelector('form.enableCameraScene button');

        console.log('Enable camera scene button found');
        await page.keyboard.press('Enter');
        console.log('Enter pressed');

        await page.waitForSelector('button#menuIcon');
    } finally {
        await page.close();
    }
}
