/// <reference types="cypress" />
import 'reflect-metadata';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
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
    (label: string, index: number = 0, parents: number = 5) => {
        let res: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('mat-label').filter((i, elt) => label === elt.innerText).eq(index);
        for (let i: number = 0; i < parents; i++) {
            res = res.parent();
        }
        return res;
    }
);

Cypress.Commands.add(
    'inputCreateTestEntity',
    () => {
        cy.getInputByLabel('Order Value 1').click().type('orderValue1');

        cy.get('.mdc-tab__text-label').contains('Tab 2').eq(0).click({ force: true });
        cy.getInputByLabel('Second Tab Value').click().type('secondTabValue');
        cy.get('.mdc-tab__text-label').contains('Tab 1').eq(0).click({ force: true });

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

        cy.getInputByLabel('Password Value').click().type('12345678');
        cy.getInputByLabel('Confirm Password').click().type('12345678');

        cy.getInputByLabel('Min Number Value').click().type('42');
        cy.get('.mdc-slider__input').click({ force: true });
        cy.getInputByLabel('Max Number Value').click().type('8');

        cy.getInputByLabel('Object Row Value 1').click().type('objectRowValue1');
        cy.getInputByLabel('Object Row Value 2').click().type('objectRowValue2');
        cy.getInputByLabel('Object Max Length Value').click().type('maxLengthObjectValue');

        cy.get('.mdc-tab__text-label').contains('Other properties').click({ force: true });
        cy.getInputByLabel('Object Second Tab Value').click().type('objectSecondTabValue');

        // eslint-disable-next-line @cspell/spellchecker
        cy.getInputByLabel('String Chips Array Value').click().type('abcd{enter}efgh{enter}');
        cy.getInputByLabel('String Chips Autocomplete Array Value').click().type('123{enter}456{enter}');

        // eslint-disable-next-line @cspell/spellchecker
        cy.getInputByLabel('String Chips Array Value With Config').click().type('abcd{enter}efgh{enter}');
        cy.getInputByLabel('String Chips Autocomplete Array Value With Config').click().type('123{enter}456{enter}');

        cy.getInputByLabel('Array Object Value').click().type('arrayObjectValue');
        cy.get('.mdc-tab__text-label').eq(5).click({ force: true });
        cy.getInputByLabel('Second Tab Value').click().type('secondTabValue');
        cy.get('button').filter((i, elt) => elt.innerText === 'Add').eq(0).click();
        cy.get('.mdc-tab__text-label').eq(4).click({ force: true });
        cy.getInputByLabel('Array Object Value').should('not.contain.text');

        cy.get('button').filter((i, elt) => elt.innerText === 'Custom Add').eq(0).click();
        cy.getInputByLabel('Array Object Value', 1).click().type('arrayObjectValueWithConfig');
        cy.get('.mdc-tab__text-label').eq(7).click({ force: true });
        cy.getInputByLabel('Second Tab Value', 2).click().type('secondTabValue');
        cy.get('button').filter((i, elt) => elt.innerText === 'Add').eq(5).click();

        cy.getInputByLabel('Date Array Value').click().type('1/1/2022');
        cy.get('button').filter((i, elt) => elt.innerText === 'Add').eq(1).click();

        cy.getInputByLabel('Custom Date Array Value').click().type('1/2/2022');
        cy.get('button').filter((i, elt) => elt.innerText === 'Custom Add').eq(1).click();

        cy.getInputByLabel('Date Time Array Value').click().type('1/1/2022');
        cy.getInputByLabel('Time', 0).click();
        cy.get('mat-option').contains('0:00').click();
        cy.get('button').filter((i, elt) => elt.innerText === 'Add').eq(2).click();

        cy.getInputByLabel('Custom Date Time Array Value').click().type('1/2/2022');
        cy.getInputByLabel('Custom Time Display Name', 0).click();
        cy.get('mat-option').contains('3:15 PM').click();
        cy.get('button').filter((i, elt) => elt.innerText === 'Custom Add').eq(2).click();

        cy.get('.mat-start-date').eq(0).click().type('1/1/2022');
        cy.get('.mat-end-date').eq(0).click().type('2/2/2022');
        cy.get('button').filter((i, elt) => elt.innerText === 'Add').eq(3).click();

        cy.get('.mat-start-date').eq(1).click().type('1/2/2022');
        cy.get('.mat-end-date').eq(1).click().type('2/20/2022');
        cy.get('button').filter((i, elt) => elt.innerText === 'Custom Add').eq(3).click();

        cy.getInputByLabel('Number Dropdown Value').click();
        cy.get('mat-option').contains('42').click();

        cy.getInputByLabel('String Dropdown Value').click();
        cy.get('mat-option').contains('String Dropdown #1').click();

        cy.getInputByLabel('Boolean Dropdown Value').click();
        cy.get('mat-option').contains('Yes').click();

        cy.getInputByLabel('Custom Boolean Dropdown Value').click();
        cy.get('mat-option').contains('True').click();

        cy.getInputByLabel('Boolean Checkbox Value').find('mat-checkbox').click();
        cy.getInputByLabel('Boolean Toggle Value').find('mat-slide-toggle').click();

        cy.getInputByLabel('Date Value').click().type('1/1/2022');
        cy.getInputByLabel('Custom Date Value').click().type('2/2/2022');
        cy.get('.mat-start-date').eq(2).click().type('1/1/2022');
        cy.get('.mat-end-date').eq(2).click().type('2/2/2022');
        cy.get('.mat-start-date').eq(3).click().type('1/2/2022');
        cy.get('.mat-end-date').eq(3).click().type('2/2/2022');
        cy.getInputByLabel('Date Time Value').click().type('1/1/2022');
        cy.getInputByLabel('Time', 1).click();
        cy.get('mat-option').contains('8:30').click();
        cy.getInputByLabel('Custom Date Time Value').click().type('2/2/2022');
        cy.getInputByLabel('Custom Time Display Name', 1).click();
        cy.get('mat-option').contains('8:30').click();

        cy.fixture('test.jpg').as('testImage');
        for (let i: number = 0; i < 5; i++) {
            cy.get('input[type=file]').eq(i).selectFile('@testImage', { force: true });
        }

        cy.getInputByLabel('Select').click();
        cy.get('mat-option').contains('#1: String Value').click();
        cy.get('button').filter((i, elt) => elt.innerText === 'Add').eq(4).click();

        cy.get('.fa-dice').click({ force: true });
    }
);