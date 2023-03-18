describe('default table', () => {
    before('Reset Api', () => {
        cy.request('POST', 'http://localhost:3000/reset/');
    });

    beforeEach('', () => {
        cy.visit('http://localhost:4200/table');
    });

    it('should show the table', () => {
        cy.get('app-showcase-table').find('.title').should('have.length', 1).should('contain', 'Default Test Entities');
        cy.get('app-showcase-table').find('mat-label').contains('Search').should('have.length', 1);
        cy.getInputByLabel('Search').should('have.class', 'col-lg-8');

        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('button').should('have.length', 3);
        cy.get('button').contains('Actions').should('not.exist');
        cy.get('button').contains('Create').should('have.length', 1);
        cy.get('button').contains('Create').parent().parent().should('have.class', 'col-lg-4');

        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('mat-checkbox').should('have.length', 0);
        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('mat-header-cell').should('have.length', 2);
        cy.get('.mat-mdc-header-row > .cdk-column-Max-and-Min-Strings').should('contain', 'Max and Min Strings');
        cy.get('.mat-mdc-header-row > .cdk-column-Object').should('contain', 'Object');

        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('.mat-mdc-row').should('have.length', 1);
        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('.mat-mdc-row > .cdk-column-Max-and-Min-Strings').should('contain', '1234 12345678');
        cy.get('.mat-mdc-row > .cdk-column-Object').should('contain', '#1 1234');
    });
    // this test is just for checking if the entity gets correctly added to the table
    // Testing of the correct content of the dialog / display of error messages etc. is done separately
    it('should create a new entity', () => {
        cy.intercept('POST', 'http://localhost:3000/testEntities').as('createTestEntity');

        cy.get('button').contains('Create').click();
        cy.get('.cdk-overlay-backdrop').should('exist');

        cy.inputCreateTestEntity();

        cy.get('button').filter((i, elt) => elt.innerText === 'Create').eq(1).click();
        cy.wait('@createTestEntity');

        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('.mat-mdc-row').should('have.length', 2);
        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('.mat-mdc-row > .cdk-column-Max-and-Min-Strings').eq(1).should('contain', 'maxL minLengthValue');
        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('.mat-mdc-row > .cdk-column-Object').eq(1).should('contain', '#undefined maxL');
    });
    // Testing of the correct content of the dialog / display of error messages etc. is done separately
    it('should delete an entity', () => {
        cy.get('.mat-mdc-row > .cdk-column-Max-and-Min-Strings').eq(1).click();
        cy.get('button').contains('Delete').click();
        cy.get('button').filter((i, elt) => elt.innerText === 'Delete').eq(1).click();
        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('.mat-mdc-row').should('have.length', 1);
    });
    // Testing of the correct content of the dialog / display of error messages etc. is done separately
    it('should edit an entity and save the changes', () => {
        cy.get('.mat-mdc-row > .cdk-column-Max-and-Min-Strings').click();
        cy.getInputByLabel('Max Length Value', 0, 3).click().clear().type('changedMaxLengthValue');
        cy.get('button').contains('Save').click();
        cy.get('.mat-mdc-row > .cdk-column-Max-and-Min-Strings').should('contain', 'chan 12345678');
    });
    // Testing of the correct content of the dialog / display of error messages etc. is done separately
    it('should edit an entity and revert the changes', () => {
        cy.get('.mat-mdc-row > .cdk-column-Max-and-Min-Strings').click();
        cy.getInputByLabel('Max Length Value', 0, 3).click().clear().type('1234');
        cy.get('button').contains('Cancel').click();
        cy.get('.mat-mdc-row > .cdk-column-Max-and-Min-Strings').should('contain', 'chan 12345678');
    });
    it('should filter with the default method', () => {
        cy.getInputByLabel('Search', 0, 3).click().type('X');
        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('.mat-mdc-row').should('have.length', 0);
        cy.getInputByLabel('Search', 0, 3).click().clear().type('123');
        cy.get('app-showcase-table').find('ngx-mat-entity-table').find('.mat-mdc-row').should('have.length', 1);
    });
});

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
        cy.get('.cdk-overlay-backdrop').click();
        cy.get('mat-checkbox').first().click();
        cy.get('button').contains('Custom Multi Select Label').click();
        cy.get('button').contains('Multi Action').parent().should('not.be.disabled');
        cy.get('button').contains('Multi Action').click();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
});