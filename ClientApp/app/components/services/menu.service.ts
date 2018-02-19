import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/primeng';

@Injectable()
export class MenuService {
    getDefaultMenu(): MenuItem[] {
        return [
            {
                label: 'Home',
                icon: 'fa fa-fw fa-home', routerLink: ['/']
            },
            {
                label: 'Counters', icon: 'fa fa-fw fa-sitemap',
                items: [
                    {
                        label: 'Counter',
                        icon: 'fa fa-fw fa-list-ol', routerLink: ['/counter']
                    },
                    {
                        label: 'PrimeNG Counter',
                        icon: 'fa fa-fw fa-list-ol', routerLink: ['/prime']
                    },
                ]
            }
        ];
    }
}