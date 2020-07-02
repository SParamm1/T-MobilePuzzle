import { $, $$, browser, ExpectedConditions } from 'protractor';
import { expect } from 'chai';

describe('When: Use the search feature', () => {
  it('Then: I should be able to search books by title', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.greaterThan(1, 'At least one book');
  });

  it('Then: I should see search results as I am typing', async () => {
  
    const input = await $('input[type="search"]');
    await input.clear();
    await input.sendKeys('java');
    let items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.greaterThan(1, 'At least one book');
    await input.sendKeys('script');
    items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.greaterThan(1, 'At least one book');
  });

  it('Then: I should see error message if there are no results returned as I am typing', async () => {

    const input = await $('input[type="search"]');
    await input.clear();
    await input.sendKeys('addadsda asd adfassd asdasdaq');
    const items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.equal(0, 'No results found');

  });
});
