import { Component, OnInit  } from '@angular/core';
import { PizzeriaService } from '../pizzeria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  userName:any;
  password:any;
  signUpUsername:any;
  signUpPassword:any;
  signUpEmail:any;
  signUpPhoneNumber:any;
  duplicateUser=false;
  constructor(private service: PizzeriaService,private router: Router) { 

  }
  
  ngOnInit(): void {
  }

  addNewUser(){
    this.service.signUpUser(this.signUpUsername,this.signUpPassword,this.signUpEmail,this.signUpPhoneNumber).subscribe((response)=>{
      if(response ==="user created successfully"){
        this.pizzasInBuffer(this.signUpUsername)
        window.alert("user signed up successfully")
        window.location.reload()
      }
      if(response ==="Problem in creating user"){
        this.duplicateUser = true
      }
    })
  }

  validateUser(){
    this.service.validateUser(this.userName,this.password).subscribe((response)=>{
      if(response === "validation sucessfull"){
        this.service.loggedInUser = this.userName
        this.service.isUserLoggedIn = true
        this.pizzasInBuffer(this.userName)
        this.router.navigate(['/home']);
      }
      else{
        this.userName=''
        window.alert("username/password doesnt match")
      }
      this.password=''
    })
  }

  pizzasInBuffer(userName:any){
    if(this.service.bufferPizzaStorage.length>0){
      this.service.addToCart(this.service.bufferPizzaStorage,userName).subscribe((response) => {
        if (response === "cart not found") {
        }
        else {
          window.alert('Pizzas were added to the cart')
        }
      })
    }
  }
}
