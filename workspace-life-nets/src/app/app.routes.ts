import { Routes } from '@angular/router';
import { PageViewComponent } from './components/pages/page-view/page-view.component';
import { PageAboutComponent } from './components/pages/page-about/page-about.component';


export const routes: Routes = [
  {
    path: '',
    component: PageViewComponent
  }
,
  {
    path: 'about',
    component: PageAboutComponent
  }

];