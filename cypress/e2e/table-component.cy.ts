describe('basic table', () => {
    before('Reset Api', () => {
        cy.request('POST', 'http://localhost:3000/reset/');
    });

    it('should visit the homepage', () => {
        cy.visit('http://localhost:4200');
    });
    it('should show the table', () => {
        cy.get('.title').should('have.length', 1).should('contain', 'Test Entities');
        cy.get('mat-label').should('have.length', 1).should('contain', 'Search');
        cy.getInputByLabel('Search').should('have.class', 'col-lg-8');

        cy.get('button').should('have.length', 3);
        cy.get('button').contains('Actions').should('not.exist');
        cy.get('button').contains('Create').should('have.length', 1);
        cy.get('button').contains('Create').parent().parent().should('have.class', 'col-lg-4');

        cy.get('mat-checkbox').should('have.length', 0);
        cy.get('mat-header-cell').should('have.length', 2);
        cy.get('.mat-header-row > .cdk-column-Max-and-Min-Strings').should('contain', 'Max and Min Strings');
        cy.get('.mat-header-row > .cdk-column-Object').should('contain', 'Object');

        cy.get('.mat-row').should('have.length', 1);
        cy.get('.mat-row > .cdk-column-Max-and-Min-Strings').should('contain', '1234 12345678');
        cy.get('.mat-row > .cdk-column-Object').should('contain', '#1 1234');
    });
    // this test is just for checking if the entity gets correctly added to the table
    // Testing of the correct content of the dialog / display of error messages etc. is done seperately
    it('should create a new entity', () => {
        cy.intercept('POST', 'http://localhost:3000/testEntities').as('createTestEntity');

        cy.get('button').contains('Create').click();
        cy.get('.cdk-overlay-backdrop').should('exist');

        cy.inputCreateTestEntity();

        cy.get('button').filter((i, elt) => elt.innerText === 'Create').eq(1).click();
        cy.wait('@createTestEntity');

        cy.get('.mat-row').should('have.length', 2);
        cy.get('.mat-row > .cdk-column-Max-and-Min-Strings').eq(1).should('contain', 'maxL minLengthValue');
        cy.get('.mat-row > .cdk-column-Object').eq(1).should('contain', '#undefined maxL');
    });
    // Testing of the correct content of the dialog / display of error messages etc. is done seperately
    it('should delete an entity', () => {
        cy.get('.mat-row > .cdk-column-Max-and-Min-Strings').eq(1).click();
        cy.get('button').contains('Delete').click();
        cy.get('button').filter((i, elt) => elt.innerText === 'Delete').eq(1).click();
        cy.get('.mat-row').should('have.length', 1);
    });
    // Testing of the correct content of the dialog / display of error messages etc. is done seperately
    it('should edit an entity and save the changes', () => {
        cy.get('.mat-row > .cdk-column-Max-and-Min-Strings').click();
        cy.getInputByLabel('Max Length Value').click().clear().type('changedMaxLengthValue');
        cy.get('button').contains('Save').click();
        cy.get('.mat-row > .cdk-column-Max-and-Min-Strings').should('contain', 'chan 12345678');
    });
    // Testing of the correct content of the dialog / display of error messages etc. is done seperately
    it('should edit an entity and revert the changes', () => {
        cy.get('.mat-row > .cdk-column-Max-and-Min-Strings').click();
        cy.getInputByLabel('Max Length Value').click().clear().type('1234');
        cy.get('button').contains('Cancel').click();
        cy.get('.mat-row > .cdk-column-Max-and-Min-Strings').should('contain', 'chan 12345678');
    });
    it('should filter with the default method', () => {
        cy.getInputByLabel('Search').click().type('X');
        cy.get('.mat-row').should('have.length', 0);
        cy.getInputByLabel('Search').click().clear().type('J');
        cy.get('.mat-row').should('have.length', 1);
    });
})