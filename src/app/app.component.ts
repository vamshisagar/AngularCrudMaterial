import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'material';

  displayedColumns: string[] = ['ProductName', 'Category', 'ProductType', 'Price', 'Action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private api: ApiService) { }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '40%'
    }).afterClosed().subscribe(val => {
      this.getAllProducts();
    })
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (res) => {
        // console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '40%',
      data: row
    }).afterClosed().subscribe(val => {
      this.getAllProducts();
    })
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id)
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Product Deleted Sucessfully',
            }
          )
          // alert("Product Deleted sucessfully");
          this.getAllProducts();
        },
        error: (res) => {
          // alert("Product failed to Delete");
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Product Failed to Delete',
            }
          )
        }
      })
  }
}
