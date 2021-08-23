import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basket$ = this.basketSource.asObservable();
  basketTotal$ = this.basketTotalSource.asObservable();
  constructor(private http: HttpClient) {

  }
  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
      map(
        (basket: any) => {
          this.basketSource.next(basket);
          this.calculateTotals();
        }
      )
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe(
      (response: any) => {
        this.basketSource.next(response);
        this.calculateTotals();
      }, error => {
        console.log(error);
      });
  }
  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdate(basket.items, itemToAdd);
    this.setBasket(basket);
  }

  private addOrUpdate(items: IBasketItem[], itemToAdd: IBasketItem): IBasketItem[] {
    console.log("inseide items ", items);
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      items.push(itemToAdd);
    } else {
      items[index].quantity += itemToAdd.quantity;
    }
    return items;
  }
  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subTotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subTotal + shipping;
    this.basketTotalSource.next({ shipping: shipping, subTotal: subTotal, total: total });
  }
  mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType,
      quantity: quantity
    }
  }
  createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }
  deleteBasket(basket:IBasket){
    return this.http.delete(this.baseUrl+'basket?id='+basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem(basket.id);
    },error => {
      console.log(error);
    });
  }
  incrementItemQuantity(item: IBasketItem) {
    console.log("increment ",item);
    const basket = this.getCurrentBasketValue();
    console.log("current basket",basket);
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    console.log("current basket",basket);
    if (foundItemIndex!==-1) {
      console.log("current basket",basket);
      basket.items[foundItemIndex].quantity++;
      this.setBasket(basket);
    }
  }
  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (foundItemIndex > 0) {
      if (basket.items[foundItemIndex].quantity > 1) {
        basket.items[foundItemIndex].quantity--;
      } else {
        this.removeItemFromBasket(item);
      }
      this.setBasket(basket);
    }
  }
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (foundItemIndex > 0) {
      basket.items = basket.items.filter(i => i.id != item.id);
      if(basket.items.length>0){
        this.setBasket(basket);
      }else{
        this.deleteBasket(basket);
      }
     
    }
  }
}


