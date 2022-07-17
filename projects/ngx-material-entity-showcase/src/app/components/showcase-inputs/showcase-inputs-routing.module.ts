import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowcaseInputsComponent } from './showcase-inputs.component';

const routes: Routes = [{ path: '', component: ShowcaseInputsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShowcaseInputsRoutingModule { }