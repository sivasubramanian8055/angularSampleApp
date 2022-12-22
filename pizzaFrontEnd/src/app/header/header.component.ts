import { Component, OnInit  } from '@angular/core';
import { PizzeriaService } from '../pizzeria.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {
  isUserLoggedIn:any;
  loggedInUser:any;
  constructor(private service: PizzeriaService){}
  
  userLogout(){
    this.service.isUserLoggedIn=false;
    this.service.loggedInUser=''
    this.isUserLoggedIn=false
    window.location.reload();
  }

  ngOnInit(): void {
    this.isUserLoggedIn  = this.service.isUserLoggedIn
    this.loggedInUser  = this.service.loggedInUser

  }


}
