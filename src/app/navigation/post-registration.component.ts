import { Component, OnInit } from '@angular/core';
import { PostRegistrationService } from '../services/post-registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-registration',
  standalone: true,
  imports: [],
  template: '',
})
export class PostRegistrationComponent implements OnInit {
  constructor(
    private postRegistrationService: PostRegistrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postRegistrationService.initializeUserProfile();
    this.router.navigate(['/index']);
  }
}
