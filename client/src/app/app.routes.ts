import { Routes } from '@angular/router';
import { Home } from '../layout/home/home';
import { MemberList } from '../features/member-list/member-list';
import { MembersDetails } from '../features/members-details/members-details';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'members', component: MemberList },
            { path: 'members/:id', component: MembersDetails },
            { path: 'lists', component: Lists },
            { path: 'messages', component: Messages },
        ]
    },
    { path: '**', component: Home },
];
