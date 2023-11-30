
describe('custom table', () => {
    before('Reset Api', () => {
        cy.request('POST', 'http://localhost:3000/reset/');
    });

    beforeEach('', () => {
        cy.visit('http://localhost:4200/table');
        cy.getInputByLabel('Table Configuration').click();
        cy.get('mat-option').contains('Custom').click();
    });

    it('should show the table', () => {
        cy.get('app-showcase-table').find('.title').should('have.length', 1).should('contain', 'Test Entities');
        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('mat-label').should('have.length', 1).should('contain', 'Custom Search Label');
        cy.getInputByLabel('Custom Search Label').should('have.class', 'col-lg-8');

        cy.get('app-showcase-table').find('button').should('have.length', 4);
        cy.get('button').contains('Custom Multi Select Label').should('exist');
        cy.get('button').contains('Custom Create Button Label').should('have.length', 1);
        cy.get('button').contains('Custom Create Button Label').parent().parent().should('have.class', 'col-lg-2');
        cy.get('button').contains('Custom Multi Select Label').parent().parent().should('have.class', 'col-lg-2');

        cy.get('mat-checkbox').should('have.length', 2);
        cy.get('mat-header-cell').should('have.length', 3);
        cy.get('.mat-mdc-header-row > .cdk-column-select').should('exist');
        cy.get('.mat-mdc-header-row > .cdk-column-Max-and-Min-Strings').should('contain', 'Max and Min Strings');
        cy.get('.mat-mdc-header-row > .cdk-column-Object').should('contain', 'Object');

        cy.get('.mat-mdc-row').should('have.length', 1);
        cy.get('.mat-mdc-row > .cdk-column-Max-and-Min-Strings').should('contain', '1234 12345678');
        cy.get('.mat-mdc-row > .cdk-column-Object').should('contain', '#1 1234');
        cy.get('.mat-mdc-row > .cdk-column-select').should('exist');
    });

    let spy: Cypress.Agent<sinon.SinonSpy<unknown[], unknown>>;
    Cypress.on('window:before:load', (win) => {
        spy = cy.spy(win.console, 'log');
    });
    it('should run multi actions', () => {
        cy.get('button').contains('Custom Multi Select Label').click();
        cy.get('button').contains('Multi Action').parent().should('be.disabled');
        cy.get('button').contains('Default Action').parent().should('not.be.disabled');
        cy.get('.cdk-overlay-backdrop').click();
        cy.get('mat-checkbox').first().click();
        cy.get('button').contains('Custom Multi Select Label').click();
        cy.get('button').contains('Multi Action').parent().should('not.be.disabled');
        cy.get('button').contains('Default Action').parent().should('not.be.disabled');
        cy.get('button').contains('Multi Action').click();
        // eslint-disable-next-line typescript/no-unused-expressions
        expect(spy).to.be.calledOnce;
    });

    it('should disable edit', () => {
        cy.get('.mat-mdc-row').click();
        cy.get('.cdk-overlay-backdrop').should('not.exist');
    });

    it('should filter with the custom method', () => {
        cy.getInputByLabel('Custom Search Label', 0, 3).click().type('123');
        cy.get('.mat-mdc-row').should('have.length', 0);
        cy.getInputByLabel('Custom Search Label', 0, 3).click().clear().type('X');
        cy.get('.mat-mdc-row').should('have.length', 1);
    });

    afterEach(function() {
        // eslint-disable-next-line typescript/no-invalid-this
        if (this.currentTest.state === 'failed') {
            // @ts-ignore
            // eslint-disable-next-line typescript/no-unsafe-member-access, typescript/no-unsafe-call
            Cypress.runner.stop();
        }
    });
});