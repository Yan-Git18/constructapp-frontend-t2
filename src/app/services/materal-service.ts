import { Injectable } from '@angular/core';
import { Material } from '../model/material';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private url: string = `${environment.HOST}/materials`;
  private materialChange: Subject<Material[]> = new Subject<Material[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(private http: HttpClient){}
  
  findAll(){
    return this.http.get<Material[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Material>(`${this.url}/${id}`);
  }

  save(material: Material){
    return this.http.post(this.url, material);
  }

  update(id: number, material: Material){
    return this.http.put(`${this.url}/${id}`, material);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  //////////////////////////
  setMaterialChange(data: Material[]){
    this.materialChange.next(data);
  }

  getMaterialChange(){
    return this.materialChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
