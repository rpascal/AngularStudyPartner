import { AngularStudyPartnerPage } from './app.po';

describe('angular-study-partner App', function() {
  let page: AngularStudyPartnerPage;

  beforeEach(() => {
    page = new AngularStudyPartnerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
