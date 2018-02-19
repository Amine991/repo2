import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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

@Component({
    selector: 'login-dialog',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
    UserSubscription: Subscription;
    LoginSubscription: Subscription;
    showWaitGraphic: boolean = false;
    user: IUser;
    isMigrateMode: boolean = false;
    username: string = "";
    password: string = "";
    passwordNew: string = "";
    errorMessage: string;

    public loginForm = this.fbLogin.group({
        username: ["", Validators.required],
        password: ["", Validators.required]
    });

    public MigrateForm = this.fbMigrate.group({
        passwordNew: ["", Validators.required],
        password: ["", Validators.required]
    });

    // Register the service
    constructor(
        private _userService: UserService,
        private _loginService: LoginService,
        public fbLogin: FormBuilder,
        public fbMigrate: FormBuilder) {
    }

    ngOnInit(): void {
        // Subscribe to the User service
        this.UserSubscription = this._userService.getCurrentUser().subscribe(
            user => {
                this.user = user;
            },
            error => {
                this.errorMessage = <any>error;
                alert(this.errorMessage);
            });

        this.showWaitGraphic = false;

        // Subscribe to the LoginSubscription Service
        this.LoginSubscription = this._loginService.getVisbility().subscribe(
            (visibility: boolean) => {

                if (visibility == true) {
                    // If the Login Dialog is true
                    // it means the Login button was pressed
                    // Set this form to the Login form
                    this.isMigrateMode = false;
                }
            });
    }

    logIn() {
        // Get the form values
        let formData = this.loginForm.value;
        this.username = formData.username;
        this.password = formData.password;

        let Authentication: IAuthentication = {
            userName: this.username,
            password: this.password
        };

        // Call the service
        this.showWaitGraphic = true;
        this._userService.loginUser(Authentication).subscribe(
            LoginStatus => {
                this.showWaitGraphic = false;

                // Was Login successful?
                if (!LoginStatus.isLoggedIn) {                    
                        alert(LoginStatus.status);
                } else {
                    // Close the Login Dialog
                    this._loginService.setVisibility(false);
                }

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
    }
}