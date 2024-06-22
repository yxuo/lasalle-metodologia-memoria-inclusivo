import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  constructor(private _router: Router) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.goToPhase1();
    }
  }

  goToPhase1() {
    this._router.navigate(['/fase'], {
      queryParams: {
        nivel: 1,
      },
    });
  }

  navigateTo(param: string) {
    this._router.navigate([param]);
  }
}
