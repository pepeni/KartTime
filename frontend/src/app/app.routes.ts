import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { LayoutComponent } from './features/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ReverseAuthGuard } from './core/guards/reverse-auth.guard';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { CourtComponent } from './features/court/court.component';
import { TournamentComponent } from './features/tournament/tournament.component';
import { CourtsComponent } from './features/courts/courts.component';
import { TournamentsComponent } from './features/tournaments/tournaments.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/courts',
        pathMatch: 'full',
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'courts', component: CourtsComponent },
            { path: 'courts/:courtId', component: CourtComponent },
            { path: 'tournaments', component: TournamentsComponent },
            { path: 'tournaments/:gpId', component: TournamentComponent },
            { path: 'profile', component: ProfileComponent },
        ],
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
    {
        path: '**',
        component: NotFoundComponent,
    }
];
