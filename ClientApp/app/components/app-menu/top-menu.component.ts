import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule, MenuItem } from 'primeng/primeng';
import { MenuService } from '../services/menu.service';

@Component({
    selector: 'top-menu',
    template: `
        <p-menubar [model]="MenuItems">        
        </p-menubar>
    `
})
export class TopMenuComponent implements OnInit {

    MenuItems: MenuItem[];

    constructor(private _MenuService: MenuService) { }

    ngOnInit() {
        this.MenuItems = this._MenuService.getDefaultMenu();
    }
}