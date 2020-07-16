import { $, $$, browser, ExpectedConditions, element, by, protractor } from 'protractor';
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
    await $('.reading-list-container h2 button').click(); 
  });

  it('Then: I am able to mark a book in the reading list as finished',async () =>{
    
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();
    
    const items = await $$('[data-testing="book-item"]');
    await $$('.book--content--info div button:enabled')
      .first()
      .click();
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
  
    await $$('.reading-list-item .reading-list-item--details div button span.mat-button-wrapper .mat-icon').click();
  
    await $$('.reading-list-item--details--author.finishedon')
    .getText()
    .then(value => expect(value[0]).contain('Finished'));
  }); 
});