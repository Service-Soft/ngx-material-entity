import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowcaseTableComponent } from './showcase-table.component';

const routes: Routes = [{ path: '', component: ShowcaseTableComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShowcaseRoutingModule { }