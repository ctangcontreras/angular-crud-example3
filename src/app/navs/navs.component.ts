import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navs',
  templateUrl: './navs.component.html',
  styleUrls: ['./navs.component.scss']
})
export class NavsComponent {
      showMenu = false;
      showMenu1 = false;
      showMenu2 = false;
      showMenu3 = false;
      hidden = false;
      showMenu4 = false;

  usuario: String = '';
  area: String = '';
  cargo: String = '';
  nombreMenu: String = '';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
    ) {}
    ngOnInit() {
      console.log(this.showMenu);

    }

  cerrarSesion(){
    sessionStorage.clear();
    this.router.navigate(['./']);
  }

  ingresar(){
    this.router.navigate(['./verRecibo'])
  }
  VerNotificacion(){
    this.hidden = true;
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  toggleMenu() {
      this.showMenu = !this.showMenu;
  }
  toggleMenu1() {
      this.showMenu1 = !this.showMenu1;
  }

}
