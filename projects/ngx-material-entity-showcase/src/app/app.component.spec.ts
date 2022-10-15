import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AppComponent
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const app: AppComponent = fixture.componentInstance;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        expect(app).toBeTruthy();
    });

    it('should render title', () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        expect(compiled.querySelector('.content span')?.textContent).toContain('ngx-material-entity-showcase app is running!');
    });
});