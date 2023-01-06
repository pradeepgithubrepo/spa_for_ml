import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponentComponent } from './mainpage/main-component/main-component.component';
import { EditComponentComponent } from './mainpage/edit-component/edit-component.component';
import { ScrawlComponentComponent } from './mainpage/scrawl-component/scrawl-component.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponentComponent,
    pathMatch: 'full'
  },
  {
    path: 'editconfig',
    component: EditComponentComponent
    // loadChildren: () => import('./configs/configs.module').then(m => m.ConfigsModule)
  }
  ,
  {
    path: 'scrawler',
    component: ScrawlComponentComponent
    // loadChildren: () => import('./configs/configs.module').then(m => m.ConfigsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
