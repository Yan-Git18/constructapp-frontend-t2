import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialService } from '../../../services/material-service';
import { SupplierService } from '../../../services/supplier-service';
import { Material } from '../../../model/material';
import { Supplier } from '../../../model/supplier';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-material-edit',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './material-edit-component.html',
  styleUrl: './material-edit-component.css'
})
export class MaterialEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;
  suppliers: Supplier[] = []; 

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idMaterial: new FormControl(),
      name: new FormControl(''),
      measurementUnit: new FormControl(''),
      unitPrice: new FormControl(0),
      actualStock: new FormControl(0),
      supplier: new FormControl()
    });

    this.supplierService.findAll().subscribe((data) => {
      this.suppliers = data;
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.materialService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idMaterial: new FormControl(data.idMaterial),
          name: new FormControl(data.name),
          measurementUnit: new FormControl(data.measurementUnit),
          unitPrice: new FormControl(data.unitPrice),
          actualStock: new FormControl(data.actualStock),
          supplier: new FormControl(data.supplier?.idSupplier) 
        });
      });
    }
  }

  operate() {
    const material: Material = new Material();
    material.idMaterial = this.form.value['idMaterial'];
    material.name = this.form.value['name'];
    material.measurementUnit = this.form.value['measurementUnit'];
    material.unitPrice = this.form.value['unitPrice'];
    material.actualStock = this.form.value['actualStock'];

    const supplier = new Supplier();
    supplier.idSupplier = this.form.value['supplier'];
    material.supplier = supplier;

    if (this.isEdit) {
      this.materialService.update(this.id, material).subscribe(() => {
        this.materialService.findAll().subscribe((data) => {
          this.materialService.setMaterialChange(data);
          this.materialService.setMessageChange('MATERIAL UPDATED!');
        });
      });
    } else {
      this.materialService
        .save(material)
        .pipe(switchMap(() => this.materialService.findAll()))
        .subscribe((data) => {
          this.materialService.setMaterialChange(data);
          this.materialService.setMessageChange('MATERIAL CREATED!');
        });
    }

    this.router.navigate(['pages/material']);
  }
}
