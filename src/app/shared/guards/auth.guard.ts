import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    let url: string = state.url;
    return await this.checkUserLogin(route, url);
  }

  async checkUserLogin(route: ActivatedRouteSnapshot, url: string) {
    if (await this.userService.isLoggedIn && this.userService.roleAs.getValue() == 'admin')
      return true;

    this.router.navigate(['/home']);
    return false;
  }
}
