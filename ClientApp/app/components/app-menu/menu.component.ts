import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IUser } from '../classes/user';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { RegisterService } from '../services/register.service';

@Component({
    selector: 'menu-component',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
    UserSubscription: Subscription;
    LoginSubscription: Subscription;
    RegisterSubscription: Subscription;
    LoginDialogVisibility: boolean = false;
    RegisterDialogVisibility: boolean = false;
    user: IUser;
    errorMessage: string;

    // Register the services
    constructor(
        private _userService: UserService,
        private _loginService: LoginService,
        private _registerService: RegisterService
    ) { }

    ngOnInit() {
        // Subscribe to the UserSubscription Service
        this.UserSubscription = this._userService.getCurrentUser().subscribe(
            user => {
                this.user = user;
            },
            error => {
                this.errorMessage = <any>error;
                alert(this.errorMessage);
            });

        // Subscribe to the LoginSubscription Service
        this.LoginSubscription = this._loginService.getVisbility().subscribe(
            (visibility: boolean) => {
                this.LoginDialogVisibility = visibility;

                if (this.LoginDialogVisibility == false) {
                    // If the Login Dialog is closed
                    // the user may be logged in
                    this.getCurrentUser();
                }
            });

        // Subscribe to the RegisterSubscription Service
        this.RegisterSubscription = this._registerService.getVisbility().subscribe(
            (visibility: boolean) => {
                this.RegisterDialogVisibility = visibility;

                if (this.RegisterDialogVisibility == false) {
                    // If the Register Dialog is closed
                    // the user may be logged in
                    this.getCurrentUser();
                }
            });
    }

    getCurrentUser() {
        // Call the service
        this._userService.getCurrentUser().subscribe(
            user => {
                this.user = user;
            },
            error => {
                this.errorMessage = <any>error;
                alert(this.errorMessage);
            });
    }

    ngOnDestroy(): void {
        // Important - Unsubscribe from any subscriptions
        this.UserSubscription.unsubscribe();
        this.LoginSubscription.unsubscribe();
        this.RegisterSubscription.unsubscribe();
    }
}