import { Profile } from './profile';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as config from './app-config.json';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  url = config.resources.todoListApi.resourceUri;

  constructor(private http: HttpClient) { }

  getProfiles() { 
    return this.http.get<Profile[]>(this.url);
  }

  getProfile(id) {
    return this.http.get<Profile>(this.url + id)
  }
  
  postProfile(profile) { 
    return this.http.post<Profile>(this.url, profile);
  }

  deleteProfile(id) {
    return this.http.delete(this.url + id);
  }

  editProfile(profile) { 
    return this.http.patch<Profile>(this.url + profile.id, profile);
  }
}
