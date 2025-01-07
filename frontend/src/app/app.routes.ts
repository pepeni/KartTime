import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { LayoutComponent } from './features/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ReverseAuthGuard } from './core/guards/reverse-auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [ReverseAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [ReverseAuthGuard]
    },
];
