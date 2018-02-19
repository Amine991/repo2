import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import {
    DialogModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
} from 'primeng/primeng';

import { IUser } from '../classes/user';
import { ILoginStatus } from '../classes/loginStatus';
import { IAuthentication } from '../classes/authentication';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { RegisterService } from '../services/register.service';

@Component({
    selector: 'user-detail',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit, OnDestroy {
    UserSubscription: Subscription;
    LoginSubscription: Subscription;
    RegisterSubscription: Subscription;
    pageTitle: string = 'Current User';
    user: IUser;
    errorMessage: string;

    // Register the services
    constructor(
        private _userService: UserService,
        private _loginService: LoginService,
        private _registerService: RegisterService,
        public fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.user = {
            userName: "[Not Logged In]",
            isLoggedIn: false
        }

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

    showLogIn() {
        // Cause the Login dialog to show
        this._loginService.setVisibility(true);
    }

    showRegister() {
        // Cause the Login dialog to show
        this._registerService.setVisibility(true);
    }

    LogOut() {
        // Call the service
        this._userService.logOutUser().subscribe(
            user => {
                this.user = user;
                // Call the method to see who 
                // the server-side 
                // thinks is logged in
                this.getCurrentUser();
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