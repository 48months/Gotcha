import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  pageNotFoundImage = '../../assets/img/page-not-found.png';

  constructor(private title: Title) {
    this.title.setTitle('404 | Page Not Found');
  }

  ngOnInit(): void {}
}
