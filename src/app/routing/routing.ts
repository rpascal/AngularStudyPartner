import { Routes, RouterModule, CanActivate} from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';


const appRoutes: Routes = [
      {
          path: '',
         redirectTo: '/home',
         pathMatch: 'full'
      },
      {
        path: 'home',
       component: HomeComponent,
      // canActivate: [AuthGaurdService]
      },
      {
        path: 'login',
        component: LoginComponent,
      // canActivate: [AuthGaurdService]
      }
//     {
//        path: 'login',
       // component: LoginComponent
//    },
//     {
//          path: 'detail/:id',
        // component: HeroUpdateComponent,
       //canActivate: [AuthGaurdService]
//    }
];
// Here we are exporting our routes
export const routing = RouterModule.forRoot(appRoutes);
// Here we are combining our routing components into a single array. We will use this a little later when we update our root module
export const routedComponents = [HomeComponent, LoginComponent];