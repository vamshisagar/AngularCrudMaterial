import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {


  foods: Food[] = [
    {value: 'Fruits', viewValue: 'Fruits'},
    {value: 'Vegetables', viewValue: 'Vegetables'},
    {value: 'Electronics', viewValue: 'Electronics'},
  ];

  freshnessList = ["New", "Refurbished","Second Hand"];

  productForm! : FormGroup;

  constructor(private formbuilder : FormBuilder, private api : ApiService) { }

  ngOnInit(): void {
    this.productForm = this.formbuilder.group({
      ProductName : ['',Validators.required],
      Category : ['',Validators.required],
      ProductType : ['',Validators.required],
      Price : ['',Validators.required],
      Comments : ['',Validators.required],

    })
  }

  addProduct(){
    // console.log(this.productForm.value);
    if(this.productForm.valid){
      this.api.postProduct(this.productForm.value)
      .subscribe({
        next : (res)=> {
          alert("Product addded sucessfully");
        },
        error : (res)=>{
          alert("Product failed to add");
        }
      })
    }
  }

}
