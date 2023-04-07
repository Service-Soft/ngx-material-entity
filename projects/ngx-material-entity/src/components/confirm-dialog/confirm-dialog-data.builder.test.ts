import { expect } from '@jest/globals';
import { ConfirmDialogDataBuilder } from './confirm-dialog-data.builder';

describe('validateInput', () => {
    test('should throw error for require confirmation and no confirmation text', () => {
        expect(() => new ConfirmDialogDataBuilder({ requireConfirmation: true }))
            .toThrow('Missing required Input data "confirmationText". You can only omit this value when "requireConfirmation" is false.');
    });
    test('should throw error for no require confirmation and confirmation text', () => {
        expect(() => new ConfirmDialogDataBuilder({ confirmationText: 'Test' }))
            .toThrow('The "confirmationText" will never be shown because "requireConfirmation" is not set to true');
    });
    test('should throw error for info-only and cancel label', () => {
        expect(() => new ConfirmDialogDataBuilder({ type: 'info-only', cancelButtonLabel: 'test' }))
            .toThrow('The "cancelButtonLabel" will never be shown because "type" is set to "info-only"');
    });
});