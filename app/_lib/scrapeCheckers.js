import { chromium } from 'playwright';
export async function scrapeCheckers() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(
      'https://www.checkers.co.za/department/fruit-veg-and-salads/fruits/apples-and-pears-3-67075da3ff9878113640070d',
      {
        waitUntil: 'networkidle',
        timeout: 60000,
      }
    );

    await page.waitForTimeout(3000); // Let JS render content

    const products = await page.$$eval('[data-auto="product-list"] li', (items) =>
      items.map((item) => {
        const name = item.querySelector('[data-auto="product-title"]')?.textContent?.trim();
        const price = item.querySelector('[data-auto="product-price"]')?.textContent?.trim();
        const image = item.querySelector('img')?.getAttribute('src');

        return { name, price, image };
      })
    );

    return products.filter(p => p.name && p.price && p.image); // Filter incomplete
  } catch (err) {
    console.error("❌ Scraping error:", err);
    throw err;
  } finally {
    await browser.close();
  }
}
