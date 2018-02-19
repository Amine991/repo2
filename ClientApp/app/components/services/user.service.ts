import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IUser } from '../classes/user';
import { IRegister } from '../classes/register';
import { ILoginStatus } from '../classes/loginStatus';
import { IRegisterStatus } from '../classes/registerStatus';
import { IAuthentication } from '../classes/authentication';

@Injectable()
export class UserService {

    constructor(private _http: Http) { }

    getCurrentUser(): Observable<IUser> {
        var _Url = 'api/Login';

        return this._http.get(_Url)
            .map((response: Response) => <IUser>response.json())
            .catch(this.handleError);
    }

    logOutUser(): Observable<IUser> {
        var _Url = 'api/LogOut';

        return this._http.get(_Url)
            .map((response: Response) => <IUser>response.json())
            .catch(this.handleError);
    }

    loginUser(Authentication: IAuthentication): Observable<ILoginStatus> {
        var _Url = 'api/Login';
        // This is a Post so we have to pass Headers
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        // Make the Angular Post
        return this._http.post(_Url, JSON.stringify(Authentication), options)
            .map((response: Response) => <ILoginStatus>response.json())
            .catch(this.handleError);
    }

    registerUser(Register: IRegister): Observable<IRegisterStatus> {
        var _Url = 'api/Register';
        // This is a Post so we have to pass Headers
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        // Make the Angular Post
        return this._http.post(_Url, JSON.stringify(Register), options)
            .map((response: Response) => <IRegisterStatus>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}