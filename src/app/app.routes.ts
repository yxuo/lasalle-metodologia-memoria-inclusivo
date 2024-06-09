import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FaseComponent } from './views/fase/fase.component';
import { MenuComponent } from './views/menu/menu.component';

export const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', component: MenuComponent },
  { path: 'fase', component: FaseComponent },
];
