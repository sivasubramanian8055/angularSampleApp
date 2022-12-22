import { Component, OnInit } from '@angular/core';
import { PizzeriaService } from '../pizzeria.service';

@Component({
  selector: 'app-order-pizza',
  templateUrl: './order-pizza.component.html',
  styleUrls: ['./order-pizza.component.css']
})
export class OrderPizzaComponent implements OnInit {
  userName: any;
  isUserLoggedIn: any;
  menuInfo: any=[];
  ingridientInfo: any=[];
  selectedPizzaForCustomization: any;
  pizzaCustomization: any = [];
  modalOpen: any;
  pizzasInCart: any = [];
  constructor(private service: PizzeriaService) { }

  ngOnInit(): void {
    this.userName = this.service.loggedInUser
    this.isUserLoggedIn = this.service.isUserLoggedIn
    this.pizzaCustomization = []
    this.modalOpen = false
    this.ingridientData()
    this.menuData()
    this.storeShoppingCartDetails()
  }

  menuData() {
    this.service.getMenu().subscribe((data) => {
      this.menuInfo = data
      this.service.menuInfo = data
      let toppings: any = []
      this.ingridientInfo.map((ingridient: any) => {
        toppings.push({ ...ingridient, checked: false })
      })
      this.menuInfo.map((pizza: any) => {
        let pizzaTopping: any = {
          pizzaName: pizza.name,
          pizzaCost: pizza.price,
          quantity: 1,
          image: pizza.image,
          description: pizza.description,
          id: pizza.id,
          toppings: toppings,
        }
        this.pizzaCustomization.push(pizzaTopping)
      })
    })
  }

  ingridientData() {
    this.service.getIngridients().subscribe((data) => {
      this.ingridientInfo = data
    })
  }

  storeShoppingCartDetails() {
    let ids = this.service.menuInfo.map((pizza: any) => pizza.id);
    if (this.isUserLoggedIn) {
      this.service.getShoppingCart().subscribe((data: any) => {
        data.items.map((item: any) => {
          if (ids.includes(item.id) && !this.pizzasInCart.includes(item.id)) {
            this.pizzasInCart.push(item.id)
          }
        })
      })
    }
    else {
      this.service.bufferPizzaStorage.map((item: any) => {
        if (ids.includes(item.id)  && !this.pizzasInCart.includes(item.id)) {
          this.pizzasInCart.push(item.id)
        }
      })
    }
  }
  onCustomizationClick(value: any) {
    this.modalOpen = true
    let elementPos = this.pizzaCustomization.map(function (x: any) { return x.pizzaName; }).indexOf(value);
    this.selectedPizzaForCustomization = elementPos
  }
  onToppingClick(event: any, value: any) {
    if (event.target.checked) {
      this.pizzaCustomization[this.selectedPizzaForCustomization].toppings[value].checked = true
    }
    else {
      this.pizzaCustomization[this.selectedPizzaForCustomization].toppings[value].checked = false
    }
  }

  onClose() {
    this.modalOpen = false;
    this.ngOnInit()
  }
  quantityOnChange(event: any, index: any) {
      this.pizzaCustomization[index].quantity = event.target.value      
  }

  addToCart() {
    this.service.addToCart([this.pizzaCustomization[this.selectedPizzaForCustomization]], this.userName).subscribe((response) => {
      if (response === "cart not found") {
        window.alert('login/signup to add pizza in the cart permanently')
        this.service.bufferPizzaStorage.push(this.pizzaCustomization[this.selectedPizzaForCustomization])
        this.ngOnInit()
      }
      else {
        window.alert('Pizza added to the cart')
        this.ngOnInit()
      }
      this.modalOpen = false
    })
  }

  removeFromCart(pizzaId:any){
    if(this.isUserLoggedIn){
      this.service.removePizzaFromCart(pizzaId).subscribe((response)=>{
        this.pizzasInCart=[]
        window.alert("Pizza removed from cart")
        this.ngOnInit()
      })
    }
    else{
      window.alert('Pizza removed from cart')
      var updatedArray = this.service.bufferPizzaStorage.filter((f:any)=> { return f.id !== pizzaId })
      this.service.bufferPizzaStorage = updatedArray
      this.pizzasInCart=[]
      this.ngOnInit()

    }
  }

 isPizzaInCart(value:any){
   if(this.pizzasInCart.includes(value)) return true 
   else return false
 }

}
