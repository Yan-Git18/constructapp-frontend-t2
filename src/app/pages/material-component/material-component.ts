import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Material } from '../../model/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialService } from '../../services/material-service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-material-component',
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './material-component.html',
  styleUrl: './material-component.css'
})
export class MaterialComponent {
  dataSource: MatTableDataSource<Material>;

  columnsDefinitions = [
    { def: 'idMaterial', label: 'idMaterial', hide: true },
    { def: 'name', label: 'name', hide: false },
    { def: 'measurementUnit', label: 'measurementUnit', hide: false },
    { def: 'unitPrice', label: 'unitPrice', hide: false },
    { def: 'actualStock', label: 'actualStock', hide: false },
    { def: 'supplier', label: 'supplier', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private materialService: MaterialService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.materialService.findAll().subscribe(data => this.createTable(data));
    this.materialService.getMaterialChange().subscribe(data => this.createTable(data));
    this.materialService.getMessageChange().subscribe(data =>
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      })
    );
  }

  createTable(data: Material[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number){
    this.materialService.delete(id)
    .pipe(switchMap(()=>this.materialService.findAll()))
    .subscribe( data => {
      this.materialService.setMaterialChange(data);
      this.materialService.setMessageChange('MATERIAL DELETED!');
    });
  }
}
