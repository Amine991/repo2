import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppModuleShared } from './app.module.shared';
import { AppComponent } from './components/app/app.component';

import { CounterService } from './components/services/counter.service';
import { LoginService } from './components/services/login.service';
import { RegisterService } from './components/services/register.service';
import { UserService } from './components/services/user.service';
import { MenuService } from './components/services/menu.service';

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        BrowserModule,
        AppModuleShared
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        CounterService,
        LoginService,
        RegisterService,
        UserService,
        MenuService,
    ]
})
export class AppModule {
}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
