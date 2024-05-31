import { EnvironmentInjector, Injector } from '@angular/core';

/**
 * A mock environment injector.
 */
export const mockInjector: EnvironmentInjector = Injector.create({
    providers: []
}) as EnvironmentInjector;