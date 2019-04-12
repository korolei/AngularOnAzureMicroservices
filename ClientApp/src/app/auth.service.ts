import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import * as auth0 from 'auth0-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: 'fHr9AYdsEV2EKT0n5hPd88jeghuxq6Ep',
    domain: 'korolei.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:5000/callback',
    scope: 'openid'
  });

  constructor(public router: Router) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public isAuthenticated() {
    const expiresAt = localStorage.getItem('expires_at');
    if(!expiresAt) return false;

    return true;
  }

  public logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public setSession(authResult: any){
    const expiresAt = JSON.stringify((authResult.expiresIn*1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public handleAuthentication(): void{
    this.auth0.parseHash((err, authResult) => {
      if(authResult && authResult.accessToken){
        this.setSession(authResult);
      }else if(err){
        this.router.navigate(['/home']);
      }
    }
  )
  }
}
