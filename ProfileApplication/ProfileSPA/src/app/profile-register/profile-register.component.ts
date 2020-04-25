import { ProfileService } from '../profile.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from '../profile';

@Component({
  selector: 'app-profile-register',
  templateUrl: './profile-register.component.html',
  styleUrls: ['./profile-register.component.css']
})
export class ProfileRegisterComponent implements OnInit {

  profile: Profile = {
    id: 0,
    userId: null,
    userPrincipalName: null,
    givenName: null,
    surname: null,
    jobTitle: null,
    mobilePhone: null,
    preferredLanguage: null,
    firstLogin: true,
  };

  constructor(private router: Router, private service: ProfileService) { }

  ngOnInit(): void {
  }

  confirmRegister(): void {
    console.log(this.profile);
    this.service.postProfile(this.profile).subscribe((response: Profile) => {
      console.log(response);
      this.router.navigate(['/profile-edit', response.id]);
    });
  }
}
