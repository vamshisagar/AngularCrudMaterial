import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Swal from 'sweetalert2';

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

  actionBtn: string = "Save";

  foods: Food[] = [
    {value: 'Fruits', viewValue: 'Fruits'},
    {value: 'Vegetables', viewValue: 'Vegetables'},
    {value: 'Electronics', viewValue: 'Electronics'},
  ];

  freshnessList = ["New", "Refurbished","Second Hand"];

  productForm! : FormGroup;

  constructor(private formbuilder : FormBuilder, private api : ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any) { }

  ngOnInit(): void {
    this.productForm = this.formbuilder.group({
      ProductName : ['',Validators.required],
      Category : ['',Validators.required],
      ProductType : ['',Validators.required],
      Price : ['',Validators.required],
      Comments : ['',Validators.required],

    });
    // console.log(this.editData);
    if(this.editData){
      this.actionBtn = "Update";
      this.productForm.controls['ProductName'].setValue(this.editData.ProductName);
      this.productForm.controls['Category'].setValue(this.editData.Category);
      this.productForm.controls['ProductType'].setValue(this.editData.ProductType);
      this.productForm.controls['Price'].setValue(this.editData.Price);
      this.productForm.controls['Comments'].setValue(this.editData.Comments);
    }
  }

  addProduct(){
    // console.log(this.productForm.value);
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next : (res)=> {
            // alert("Product addded sucessfully");
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Product Added sucessfully',
              }
            )
            this.productForm.reset();
          },
          error : (res)=>{
            // alert("Product failed to add");
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Product Failed to Add',
              }
            )
          }
        })
      }
    }
    else{
      this.api.updateProduct(this.productForm.value,this.editData.id)
      .subscribe({
        next : (res)=> {
          // alert("Product Updated sucessfully");
          Swal.fire({
            icon: 'success',
            title: 'Updated...',
            text: 'Product Updated sucessfully',
            }
          )
          this.productForm.reset();
        },
        error : (res)=>{
          // alert("Product failed to Update");
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Product failed to Update',
            }
          )
        }
      })
    }
  }

}
