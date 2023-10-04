const FILES = {
    boats: { filePath: "../../test/browser/files/boats.jpg" },
    doge: { filePath: "../../test/browser/files/doge.png" },
};

describe("notStore browser testing", function () {
    before((done) => {
        cy.exec("npm run buildtest").then(() => {
            done();
        });
    });

    it("ui test", function () {
        cy.visit("http://localhost:7357/ui.upload.html");
    });
});
