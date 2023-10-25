import { EnvironmentInjector, Injector } from '@angular/core';

/**
 * A mock environment injector.
 */
export const mockInjector: EnvironmentInjector = Injector.create({
    providers: [
    //   { provide: ServiceA, useValue: serviceA },
    //   { provide: ServiceB, useValue: serviceB },
    ]
}) as EnvironmentInjector;