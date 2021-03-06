﻿import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ToolbarModule, TieredMenuModule, MenuItem } from 'primeng/primeng';
import { IUser } from '../classes/user';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { RegisterService } from '../services/register.service';
import { MenuService } from '../services/menu.service';

@Component({
    selector: 'side-menu',
    template: `
        <p-toolbar> 
        <div class="ui-toolbar-group-left">
        <button #btn type="button" pButton label="Menu" icon="fa fa-bars" 
         class="ui-button-secondary" (click)="openMenu(menu, $event)"></button>
        <p-tieredMenu #menu [model]="MenuItems" [popup]="true">
        </p-tieredMenu>  
        </div>
        </p-toolbar>
    `
})
export class SideMenuComponent implements OnInit, OnDestroy {
    LoginSubscription: Subscription;
    RegisterSubscription: Subscription;
    MenuItems: MenuItem[] = [];
    user: IUser;
    errorMessage: string;

    // Register the service
    constructor(
        private _userService: UserService,
        private _loginService: LoginService,
        private _registerService: RegisterService,
        private _MenuService: MenuService
    ) { }

    ngOnInit(): void {

        // Subscribe to the LoginSubscription Service
        this.LoginSubscription = this._loginService.getVisbility().subscribe(
            (visibility: boolean) => {
                if (visibility == false) {
                    // If the Login Dialog is closed
                    // the user may be logged in
                    this.getCurrentUser();
                }
            });

        // Subscribe to the RegisterSubscription Service
        this.RegisterSubscription = this._registerService.getVisbility().subscribe(
            (visibility: boolean) => {
                if (visibility == false) {
                    // If the Register Dialog is closed
                    // the user may be logged in
                    this.getCurrentUser();
                }
            });
    }

    public openMenu(menu: any, event: any) {
        // Toggle the menu
        menu.toggle(event);
        // Get status of user to determine if the Login button
        // needs to be shown
        this.getCurrentUser();
    }

    getCurrentUser() {
        // Call the service
        this._userService.getCurrentUser().subscribe(
            user => {
                this.user = user;

                // Clear Menu
                this.MenuItems = [];
                let newMenu: MenuItem[] = [];

                // Build new Menu
                if (!this.user.isLoggedIn) {                    
                    newMenu = newMenu.concat(this.getLoginMenu(), this._MenuService.getDefaultMenu());                    
                } else {
                    newMenu = newMenu.concat(this.getLogoffMenu(), this._MenuService.getDefaultMenu());   
                }          

                // Set Menu
                this.MenuItems = newMenu;

            },
            error => {
                this.errorMessage = <any>error;
                alert(this.errorMessage);
            });
    }

    showLogIn() {
        // Cause the Login dialog to show
        this._loginService.setVisibility(true);
    }

    showRegister() {
        // Cause the Register dialog to show
        this._registerService.setVisibility(true);
    }

    ngOnDestroy(): void {
        // Important - Unsubscribe from any subscriptions
        this.LoginSubscription.unsubscribe();
        this.RegisterSubscription.unsubscribe();
    }

    // Custom Menus

    getLogoffMenu(): MenuItem[] {
        return [
            {
                label: 'Logout',
                icon: 'fa fa-fw fa-sign-out', command: (event) => {
                    // Call the service
                    this._userService.logOutUser().subscribe(
                        user => {
                            this.user = user;
                            // Call the method to see who 
                            // the server-side 
                            // thinks is logged in
                            this.getCurrentUser();

                            // Cause any subscriptions to the Login dialog to trigger
                            // This will cause the User control for the full width
                            // mode to update to loggoff mode
                            this._loginService.setVisibility(false);
                        },
                        error => {
                            this.errorMessage = <any>error;
                            alert(this.errorMessage);
                        });
                }
            }
        ];
    }

    getLoginMenu(): MenuItem[] {
        return [
            {
                label: 'Login',
                icon: 'fa fa-fw fa-sign-in', command: (event) => { 
                    this.showLogIn();
                }
            },
            {
                label: 'Register',
                icon: 'fa fa-fw fa-user-plus', command: (event) => {
                    this.showRegister();
                }
            }
        ];
    }
}