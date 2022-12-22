import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PizzeriaService {
  loggedInUser:any ='';
  isUserLoggedIn:any = false;
  bufferPizzaStorage:any = [];
  menuInfo:any = [];
  constructor(private client: HttpClient) { }

  getMenu() {
    return this.client.get("http://localhost:3200/getMenu");
  }

  getIngridients() {
    return this.client.get("http://localhost:3200/getIngridents");
  }

  validateUser(userName:any,password:any){
    var body={
      userName:userName,
      password:password,
    }
    return this.client.post("http://localhost:3200/validateUser",body,{responseType: 'text'});
  }
  signUpUser(userName:any,password:any, email:any, phoneNumber:any){
    var body={
        userName: userName,
        password: password,
        email: email,
        phoneNumber: phoneNumber
    }
    return this.client.post("http://localhost:3200/addUser",body,{responseType: 'text'});
  }
  addToCart(pizzas:any,userName:any){
    var body ={
      userName : userName,
      pizzas: pizzas
    }
    return this.client.post("http://localhost:3200/addItemInShopingCart",body,{responseType: 'text'});
  }

  getShoppingCart(){
    if(this.isUserLoggedIn)
    return this.client.post("http://localhost:3200/findShopingCart",{userName: this.loggedInUser});
    else
    return this.bufferPizzaStorage
  }

  removePizzaFromCart(pizzaIds:any){
    return this.client.post("http://localhost:3200/deleteItemsFromCart",{userName: this.loggedInUser, pizzaIds:[pizzaIds]},{responseType: 'text'});
  }

  modifyQuantity(pizzaId:any, quantity:any){
    return this.client.post("http://localhost:3200/modifyItemsCount",{userName: this.loggedInUser, pizzaId:pizzaId ,quantity:quantity},{responseType: 'text'});
  }

}
