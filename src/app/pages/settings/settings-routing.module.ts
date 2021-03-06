import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsAppComponent } from './app/settings-app.component';
import { SettingsComponent } from './settings.component';
import { SettingsSystemComponent } from './system/settings-system.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'app',
        component: SettingsAppComponent,
      },
      {
        path: 'system',
        component: SettingsSystemComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}

export const routedComponents = [SettingsComponent, SettingsAppComponent, SettingsSystemComponent];
