import { $, $$, browser, ExpectedConditions } from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should be able to undo addition of a book from the reading list', async () => {
    let readingList = await $$('.reading-list-item');
    const initialListCount = readingList.length;

    const readingListButton = await $('.reading-list-container h2 button');
    await readingListButton.click();

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const item = await $$('[data-testing="book-item"]');
    await $$('.book--content--info div button:enabled')
      .first()
      .click();

    await browser.executeScript(`
      const undoButton = document.querySelector("simple-snack-bar button");
      undoButton.click();
    `);

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    readingList = await $$('.reading-list-item');
    const finalListCount = readingList.length;
    expect(initialListCount).to.equal(finalListCount);
  });
});
