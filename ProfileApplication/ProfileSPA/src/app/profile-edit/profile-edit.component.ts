import { ProfileService } from '../profile.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Profile } from '../profile';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  public profile: Profile = {
    id: null,
    userId: null,
    userPrincipalName: null,
    givenName: null,
    surname: null,
    jobTitle: null,
    mobilePhone: null,
    preferredLanguage: null,
    firstLogin: false,
  };

  constructor(private route: ActivatedRoute, private router: Router, private service: ProfileService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let id = +params.get('id');
      this.service.getProfile(id).subscribe((response: Profile) => {
        this.profile = response;
      })
    })

  }

  editProfile(profile) {
    this.profile.userPrincipalName = profile.userPrincipalName;
    this.profile.givenName = profile.givenName;
    this.profile.surname = profile.surname;
    this.profile.jobTitle = profile.jobTitle;
    this.profile.mobilePhone = profile.mobilePhone;
    this.profile.preferredLanguage = profile.preferredLanguage;

    this.service.editProfile(this.profile).subscribe((response) => {
      console.log(response);
      this.router.navigate(['/profile-view']);
    })
  }

}
