import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { OrderPizzaComponent } from './order-pizza/order-pizza.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  {path:'orderPizza',component:OrderPizzaComponent},
  {path:'home',component:HomeComponent},
  {path:'login',component: LoginPageComponent},
  {path:'shopingCart',component: ShoppingCartComponent},
  {path:'',redirectTo:'/home',pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
