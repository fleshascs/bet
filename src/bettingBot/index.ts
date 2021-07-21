import { launch } from 'puppeteer';
import { createBrowser } from './createBrowser';

(async () => {
  // const { browser, page } = await createBrowserAndPage();
  const browser = await createBrowser({});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const url = 'https://iggbet.com/en?sportIds[]=esports_counter_strike';

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // const f12 = await browser.target().createCDPSession();
  // await f12.send('Network.enable');
  // await f12.send('Page.enable');
  // await page.close();
  // await browser.close();

  // const browser = await launch({ headless: false });
  // const page = await browser.newPage();
  // await page.goto('https://iggbet.com', {
  //   waitUntil: 'networkidle2'
  // });
  // await page.pdf({ path: 'hn.pdf', format: 'a4' });

  // await browser.close();
})();

// async function createBrowserAndPage() {
//   const browser = await launch({ headless: false });
//   const page = await browser.newPage();
//   await page.setUserAgent(getUserAgent());
//   await page.setViewport({ width: 1920, height: 1080 });

//   return { browser, page };
// }

//save cokies
// https://stackoverflow.com/questions/56514877/how-to-save-cookies-and-load-it-in-another-puppeteer-session
