const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    //השורה הזאת היא בהתאם למחשב שעליו רצה התוכנית
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
  });
  //פתיחת עמוד חדש
  const page = await browser.newPage();
  await page.goto('https://www.google.com');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // הקלדת טקסט בשורת החיפוש של Google
  await page.type('textarea[name="q"]', 'OpenAI');
  console.log("GOOGLE");

  await new Promise(resolve => setTimeout(resolve, 1000));

  // לחיצה על כפתור החיפוש
  await page.keyboard.press('Enter');

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const searchResults = await page.evaluate(() => {
      const tableRows = Array.from(document.querySelectorAll('div.usJj9c')); // בחירת אלמנטי div של הטבלה
      const results = [];

      tableRows.forEach(row => {
        const linkElement = row.querySelector('a'); // בחירת האלמנט של הקישור בתוך כל שורה
        if (linkElement) {
          const title = linkElement.innerText; 
          const url = linkElement.href; 
          results.push({ title, url }); // הוספת התוצאה למערך
        }
      });

      return results.slice(0, 5); // החזרת רק חמש התוצאות הראשונות
    });
  //הדפסת התוצאות 
    console.log("Top 5 search results:");
    searchResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title} - ${result.url}`);
    });
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    // סגירת העמוד הנוכחי
    await page.close();
    
  } catch (error) {
    console.error('An error occurred while evaluating the page:', error);
  }

  await new Promise(resolve => setTimeout(resolve, 3000));

  // פתיחת עמוד חדש של Bing
  const newPage = await browser.newPage();
  await newPage.goto('https://www.bing.com');

  await new Promise(resolve => setTimeout(resolve, 2000)); 

  // הקלדת טקסט בשורת החיפוש של Bing
  await newPage.type('input[name="q"]', 'puppeteer');
  console.log("BING");
  await new Promise(resolve => setTimeout(resolve, 2000)); 

  // לחיצה על כפתור החיפוש
  await newPage.keyboard.press('Enter');
  await new Promise(resolve => setTimeout(resolve, 8000)); 

  try{
  const bingSearchResults = await newPage.evaluate(() => {
    const resultItems = Array.from(document.querySelectorAll('li.b_algo'));
    const results = [];

    resultItems.slice(0, 5).forEach(item => {
      const linkElement = item.querySelector('h2 a');
      if (linkElement) {
        const title = linkElement.innerText;
        const url = linkElement.href;
        results.push({ title, url });
      }
    });

    return results;
  });

  console.log("Top 5 search results on Bing:");
  bingSearchResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.title} - ${result.url}`);
  });

  await new Promise(resolve => setTimeout(resolve,4000)); 
} catch (error) {
  console.error('An error occurred while evaluating the page:', error);
}

  await browser.close();
})(); 
