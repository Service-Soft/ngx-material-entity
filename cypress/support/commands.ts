/// <reference types="cypress" />
import 'reflect-metadata';

declare global {
    namespace Cypress {
        // eslint-disable-next-line jsdoc/require-jsdoc
        interface Chainable {
            /**
             * Gets the mat-input by the provided label.
             */
            getInputByLabel: (label: string, index?: number, parents?: number) => Chainable<JQuery<HTMLElement>>,
            /**
             * Inputs values for a default create test entity.
             */
            inputCreateTestEntity: () => Chainable<JQuery<HTMLElement>>
        }
    }
}

Cypress.Commands.add(
    'getInputByLabel',
    (label: string, index: number = 0, parents: number = 6) => {
        let res = cy.get('mat-label').filter((i, elt) => label === elt.innerText).eq(index);
        for (let i = 0; i < parents; i++) {
            res = res.parent();
        }
        return res;
    }
);

Cypress.Commands.add(
    'inputCreateTestEntity',
    () => {
        cy.getInputByLabel('Order Value 1').click().type('orderValue1');
        cy.getInputByLabel('Order Value 2').click().type('orderValue2');
        cy.getInputByLabel('Order Value 3').click().type('orderValue3');

        cy.getInputByLabel('Omit for Update Value').click().type('omitForUpdateValue');

        cy.getInputByLabel('Row Value').click().type('rowValue');

        cy.getInputByLabel('Max Length Value').click().type('maxLengthValue');
        cy.getInputByLabel('Min Length Value').click().type('minLengthValue');
        cy.getInputByLabel('Regex Value').click().type('123');

        cy.getInputByLabel('Max Length Autocomplete Value').click().type('maxLengthAutocompleteValue');
        cy.getInputByLabel('Min Length Autocomplete Value').click().type('minLengthAutocompleteValue');
        cy.getInputByLabel('Regex Autocomplete Value').click().type('456');

        cy.getInputByLabel('Max Length Textbox Value').click().type('maxLengthTextboxValue');
        cy.getInputByLabel('Min Length Textbox Value').click().type('minLengthTextboxValue');

        cy.getInputByLabel('Min Number Value').click().type('42');
        cy.getInputByLabel('Max Number Value').click().type('8');

        cy.getInputByLabel('Object Row Value 1').click().type('objectRowValue1');
        cy.getInputByLabel('Object Row Value 2').click().type('objectRowValue2');
        cy.getInputByLabel('Object Max Length Value').click().type('maxLengthObjectValue');

        // eslint-disable-next-line @cspell/spellchecker
        cy.getInputByLabel('String Chips Array Value').click().type('abcd{enter}efgh{enter}');
        cy.getInputByLabel('String Chips Autocomplete Array Value').click().type('123{enter}456{enter}');

        // eslint-disable-next-line @cspell/spellchecker
        cy.getInputByLabel('String Chips Array Value With Config').click().type('abcd{enter}efgh{enter}');
        cy.getInputByLabel('String Chips Autocomplete Array Value With Config').click().type('123{enter}456{enter}');

        cy.getInputByLabel('Array Object Value').click().type('arrayObjectValue');
        cy.get('button').filter((i, elt) => elt.innerText === 'Add').eq(0).click();

        cy.get('button').filter((i, elt) => elt.innerText === 'Custom Add').click();
        cy.getInputByLabel('Array Object Value', 1).click().type('arrayObjectValueWithConfig');
        cy.get('button').filter((i, elt) => elt.innerText === 'Add').eq(1).click();

        cy.getInputByLabel('Number Dropdown Value').click();
        cy.get('mat-option').contains('42').click();

        cy.getInputByLabel('String Dropdown Value').click();
        cy.get('mat-option').contains('String Dropdown #1').click();

        cy.getInputByLabel('Boolean Dropdown Value').click();
        cy.get('mat-option').contains('Yes').click();

        cy.getInputByLabel('Boolean Checkbox Value').find('mat-checkbox').click();
        cy.getInputByLabel('Boolean Toggle Value').find('mat-slide-toggle').click();

        cy.getInputByLabel('Date Value').click().type('1/1/2022');
        cy.getInputByLabel('Custom Date Value').click().type('2/2/2022');
        cy.get('.mat-start-date').eq(0).click().type('1/1/2022');
        cy.get('.mat-end-date').eq(0).click().type('2/2/2022');
        cy.get('.mat-start-date').eq(1).click().type('1/2/2022');
        cy.get('.mat-end-date').eq(1).click().type('2/2/2022');
        cy.getInputByLabel('Date Time Value').click().type('1/1/2022');
        cy.getInputByLabel('Time').click();
        cy.get('mat-option').contains('8:30').click();
        cy.getInputByLabel('Custom Date Time Value').click().type('2/2/2022');
        cy.getInputByLabel('Custom Time Display Name').click();
        cy.get('mat-option').contains('8:30').click();
    }
);