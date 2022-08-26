import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="collapse navbar-collapse" id="navbarNavDropdown">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home</a>
    </ul>
  </div>
</nav>
  `,
  styles: [
  ]
})
export class HeaderComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
