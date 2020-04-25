import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Configuration } from 'msal';
import { 
  MsalService, 
  MSAL_CONFIG, 
  MSAL_CONFIG_ANGULAR, 
  MsalAngularConfiguration, 
  BroadcastService 
} from '@azure/msal-angular';

import { isIE, protectedResourceMap } from './app.module';
import * as config from './app-config.json';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatListModule,
      ],
      declarations: [
        AppComponent,

      ],
      providers: [
        MsalService,
        {
          provide: MSAL_CONFIG,
          useValue: {
            auth: {
              clientId: config.auth.clientId,
              authority: config.auth.authority,
              redirectUri: config.auth.redirectUri,
            },
            cache: {
              cacheLocation: config.cache.cacheLocation,
              storeAuthStateInCookie: false
            },
          } as Configuration
        },
        {
          provide: MSAL_CONFIG_ANGULAR,
          useValue: {
            popUp: isIE,
            consentScopes: [
              config.resources.todoListApi.resourceScope,
              ...config.scopes.loginRequest
            ],
            unprotectedResources: [],
            protectedResourceMap
          } as MsalAngularConfiguration
        },
        BroadcastService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Microsoft Identity Platform'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Microsoft Identity Platform');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('Microsoft Identity Platform');
  });
});
