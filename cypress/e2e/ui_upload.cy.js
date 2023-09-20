const FILES = {
  boats: {filePath: '../../test/browser/files/boats.jpg'},
  'doge': {filePath: '../../test/browser/files/doge.png'},
};

describe('notStore browser testing', function() {
  before(async () => {
    await cy.exec('npm run buildtest');
  });
/*
  it('basic test', (done) => {
    cy.visit('http://localhost:7357/index.html');
    done();
  });
*/
  it('ui test', function(){
    cy.visit('http://localhost:7357/ui.upload.html');  
  });

});
