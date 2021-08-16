import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search',{static:true}) searchTerm : ElementRef;
  products : IProduct[] = [];
  brands : IBrand[] = [];
  productTypes : IProductType[] = [];
  shopParams = new ShopParams();
  totalCount :number;
  sortOptions = [
    {name:'Alphabetical',value:'name'},
    {name:'Price : Low to Height',value:'priceAsc'},
    {name:'Price : Height to Low',value:'priceDesc'},
  ];
  constructor(private shopService:ShopService) { }

  ngOnInit(): void {
  this.getProducts();
    this.getBrands();
    this.getProductTypes();

  }

  getProducts(){
  
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      console.log(response);
      this.products = response.data  ;
      this.shopParams.PageNumber = response.pageIndex;
      this.shopParams.PageSize = response.pageSize;
      this.totalCount = response.count;
    },error => {
      console.log(error);
    });
  }

  getBrands(){
    this.shopService.getBrands().subscribe(response => {

      this.brands = [{id:0,name:"All"},...response];
    },error => {
      console.log(error);
    });
  }
  getProductTypes(){
    this.shopService.getProductTypes().subscribe(response => {

      this.productTypes = [{id:0,name:"All"},...response];
    },error => {
      console.log(error);
    });
  }

  onSortSelected(sort:string){
    this.shopParams.sort=sort;
    this.getProducts();
  }
  onBrandSelected(brandId:number){
    this.shopParams.brandId = brandId;
    this.shopParams.PageNumber=1;
    this.getProducts();
  }
  onTypeSelected(typeId:number){
    this.shopParams.typeId = typeId;
    this.shopParams.PageNumber=1;
    this.getProducts();
  }

  onPageChanged(event:number){
    if( this.shopParams.PageNumber !=event){
      this.shopParams.PageNumber = event; 
      this.getProducts();
    }
  
  }

  onSearch(){
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.PageNumber=1;
    this.getProducts();
  }
  onReset(){
    this.searchTerm.nativeElement.value='';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
