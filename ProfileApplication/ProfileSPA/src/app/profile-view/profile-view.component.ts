import { ProfileService } from '../profile.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError, AuthError } from 'msal';
import * as config from '../app-config.json';
import { Profile } from '../profile';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  
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

  profiles: Profile[];

  canEdit: boolean = false;

  constructor(private authService: MsalService, private router: Router, private service: ProfileService, private broadcastService: BroadcastService) { }

  ngOnInit(): void {
    this.broadcastService.subscribe('msal:acquireTokenSuccess', (payload) => {
      console.log(payload);
      console.log('access token acquired: ' + new Date().toString());
      
    });
 
    this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => {
      console.log(payload);
      console.log('access token acquisition fails');
    });

    this.getProfile();
  }

  getProfile(): void {
    this.service.getProfiles().subscribe({
      next: (response: Profile[]) => {
        console.log(response);

        if (!response.length || !response) {
          console.log('first login');
          
          this.router.navigate(['/profile-register']);
        } else {
          this.profile = response[0];
        }
        
      },
      error: (err: AuthError) => {
        // If there is an interaction required error,
        // call one of the interactive methods and then make the request again.
        if (InteractionRequiredAuthError.isInteractionRequiredError(err.errorCode)) {
          this.authService.acquireTokenPopup({
            scopes: this.authService.getScopesForEndpoint(config.resources.todoListApi.resourceUri)
          })
          .then(() => {
            this.service.getProfiles()
              .toPromise()
              .then((response: Profile[])  => {
                console.log(response);
                
                if (!response.length) {
                  console.log('first login');
                  this.router.navigate(['/profile-register']);
                } else {
                  this.profile = response[0];
                }
              });
          });
        }
      }
    });
  }

}
