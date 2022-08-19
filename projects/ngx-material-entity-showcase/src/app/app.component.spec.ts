import { TestBed } from '@angular/core/testing';
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
            ],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        expect(app).toBeTruthy();
    });

    it('should have as title \'ngx-material-entity-showcase\'', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        expect(app.title).toEqual('ngx-material-entity-showcase');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        expect(compiled.querySelector('.content span')?.textContent).toContain('ngx-material-entity-showcase app is running!');
    });
});