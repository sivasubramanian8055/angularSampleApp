import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { PizzeriaService } from '../pizzeria.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  shopingCartDetails: any = [];
  toppingsOfPizza: any = [];
  costOfEveryPizza: any = [];
  constructor(private service: PizzeriaService) { }

  ngOnInit(): void {
    this.storeShoppingCartDetails()
    this.storePizzaDetails()
  }
  storeShoppingCartDetails() {
    if (this.service.isUserLoggedIn)
      this.service.getShoppingCart().subscribe((data: any) => {
        this.shopingCartDetails = data.items
      })
    else {
      this.shopingCartDetails = this.service.bufferPizzaStorage
    }
  }

  isPizzaCartEmpty() {
    if (this.shopingCartDetails.length === 0) return true
    else return false
  }

  storePizzaDetails() {
    let toppingOfPizza: any = []
    let pizzaCost: any = []
    if (this.service.isUserLoggedIn) {
      this.service.getShoppingCart().subscribe((data: any) => {
        data.items.map((pizza: any) => {
          let tempPizzaCost = parseInt(pizza.quantity) * pizza.pizzaCost
          let toppings = pizza.toppings.map((topping: any) => {
            if (topping.checked) {
              tempPizzaCost += topping.price
              return topping.tname
            }
          })
          pizzaCost.push(tempPizzaCost)
          toppingOfPizza.push(toppings)
        })
      })
    }
    else {
      this.shopingCartDetails.map((pizza: any) => {
        let tempPizzaCost = parseInt(pizza.quantity) * pizza.pizzaCost
        let toppings = pizza.toppings.map((topping: any) => {
          if (topping.checked) {
            tempPizzaCost += topping.price
            return topping.tname
          }
        })
        pizzaCost.push(tempPizzaCost)
        toppingOfPizza.push(toppings)
      })
    }
    this.costOfEveryPizza = pizzaCost
    this.toppingsOfPizza = toppingOfPizza
  }

  removeFromCart(pizzaId: any) {
    if (this.service.isUserLoggedIn) {
      this.service.removePizzaFromCart(pizzaId).subscribe((response) => {
        this.shopingCartDetails = []
        window.alert("Pizza removed from cart")
        this.ngOnInit()
      })
    }
    else {
      window.alert('Pizza removed from cart')
      var updatedArray = this.service.bufferPizzaStorage.filter((f: any) => { return f.id !== pizzaId })
      this.service.bufferPizzaStorage = updatedArray
      this.shopingCartDetails = []
      this.ngOnInit()

    }
  }
  quantityOnChange(event: any, index: any, pizzaId: any) {
    if (!this.service.isUserLoggedIn) {
      this.service.bufferPizzaStorage[index].quantity = event.target.value
    }
    else {
      this.service.modifyQuantity(pizzaId, event.target.value).subscribe((response) => {
        window.alert("quantity updated")
        this.shopingCartDetails = [];
        this.toppingsOfPizza = [];
        this.costOfEveryPizza = [];
      })
    }
    this.ngOnInit()
  }

  getCartCost(){
    var sum = this.costOfEveryPizza.reduce(function (x:number, y:number) {
      return x + y;
  }, 0);
  return sum
  }

  onCheckoutClick(){
    if(this.service.isUserLoggedIn){
      window.alert("checkout successfull")
    }
    else{
      window.alert("Please login for further process")
    }
  }
}
