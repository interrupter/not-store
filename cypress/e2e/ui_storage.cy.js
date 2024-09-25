const FILE_COUNT = 4;

describe("notStore storage UI", function () {
    before(() => {
        cy.exec("npm run buildtest");
    });

    it("basic", function () {
        cy.visit("http://localhost:7357/ui.storage.html");
        cy.get(".file-list").should("exist");
        cy.get("#role-root .file-tile").then((els) => {
            expect(els.length).to.be.equal(FILE_COUNT);
        });
        cy.get("#role-root .file-tile:first-child").should(
            "not.have.class",
            "selected"
        );
        cy.get("#role-root .file-tile:first-child").click();
        cy.get("#role-root .file-tile:first-child").should(
            "have.class",
            "selected"
        );
        cy.get("#role-root .file-tile:first-child").click();
        cy.get("#role-root .file-tile:first-child").should(
            "not.have.class",
            "selected"
        );
        cy.get("#role-root .file-tile:first-child").click();
        cy.get("#role-root .file-tile:nth-child(2)").click();
        cy.get("#role-root .file-tile.selected").then((els) => {
            expect(els.length).to.be.equal(2);
        });
        cy.get("#role-root .file-tile:first-child").click();
        cy.get("#role-root .file-tile.selected").then((els) => {
            expect(els.length).to.be.equal(1);
        });

        cy.get("#role-user .file-tile").then((els) => {
            expect(els.length).to.be.equal(FILE_COUNT);
        });
        cy.get("#role-user .file-tile:first-child").should(
            "not.have.class",
            "selected"
        );
        cy.get("#role-user .file-tile:first-child").click();
        cy.get("#role-user .file-tile:first-child").should(
            "have.class",
            "selected"
        );
        cy.get("#role-user .file-tile:first-child").click();
        cy.get("#role-user .file-tile:first-child").should(
            "not.have.class",
            "selected"
        );
        cy.get("#role-user .file-tile:first-child").click();
        cy.get("#role-user .file-tile:nth-child(2)").click();
        cy.get("#role-user .file-tile.selected").then((els) => {
            expect(els.length).to.be.equal(1);
        });
        cy.get("#role-user .file-tile:first-child").click();
        cy.get("#role-user .file-tile.selected").then((els) => {
            expect(els.length).to.be.equal(1);
        });

        cy.get("#popupTrigger").click();

        cy.get(".modal .file-tile").then((els) => {
            expect(els.length).to.be.equal(FILE_COUNT);
        });
        const img = {};

        function randomInteger(min, max) {
            // случайное число от min до (max+1)
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }
        let i = randomInteger(1, FILE_COUNT);
        cy.get(`.modal .file-tile:nth-child(${i})`).then((els) => {
            let el = els[0];
            img.uuid = el.dataset.uuid;
            img.src = el.querySelector("img").src;
        });
        cy.get(`.modal .file-tile:nth-child(${i})`).click();
        cy.get(".modal .button.is-success").click();

        cy.get("#results img").then((els) => {
            expect(els.length).to.be.equal(1);
            expect(els[0].src).to.be.equal(img.src);
            expect(els[0].id).to.be.equal(img.uuid);
        });

        cy.get("#popupTrigger").click();
        cy.get(".modal .file-tile").then((els) => {
            expect(els.length).to.be.equal(FILE_COUNT);
        });

        i = randomInteger(1, FILE_COUNT);
        cy.get(`.modal .file-tile:nth-child(${i})`).then((els) => {
            let el = els[0];
            img.uuid = el.dataset.uuid;
            img.src = el.querySelector("img").src;
        });
        cy.get(`.modal .file-tile:nth-child(${i})`).click();
        cy.get(".modal .button.is-danger").click();
        cy.get(".modal .button.confirm-disapprove").click();
        cy.get(".modal .file-tile").then((els) => {
            expect(els.length).to.be.equal(FILE_COUNT);
        });
        cy.get(".modal .button.is-danger").click();
        cy.get(".modal input.confirm-approval").click();
        cy.get(".modal .button.confirm-approve").click();
        cy.wait(100);
        cy.get(".modal .file-tile").then((els) => {
            expect(els.length).to.be.equal(FILE_COUNT - 1);
        });

        i = randomInteger(1, FILE_COUNT - 1);
        cy.get(`.modal .file-tile:nth-child(${i}) .delete`).click();
        cy.get(".modal input.confirm-approval").click();
        cy.get(".modal .button.confirm-approve").click();
        cy.wait(100);
        cy.get(".modal .file-tile").then((els) => {
            expect(els.length).to.be.equal(FILE_COUNT - 2);
        });
    });
});
