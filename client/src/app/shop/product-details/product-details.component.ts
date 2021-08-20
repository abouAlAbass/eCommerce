import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct ;
  constructor(
    private shopservice: ShopService,
    private activateRoute: ActivatedRoute,
    private bcService : BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.shopservice.getProduct(+this.activateRoute.snapshot.paramMap.get("id")).subscribe(product => {
      this.product = product;
      console.log(product);
      this.bcService.set('@productDetails',product.name);
    }, error => {
      console.log(error)
    });
  }
}
