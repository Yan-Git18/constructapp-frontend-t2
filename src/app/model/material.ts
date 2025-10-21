import { Supplier } from "./supplier";

export class Material{
    idMaterial: number;
    name: string;
    measurementUnit: string;
    unitPrice: number;
    actualStock: number;
    supplier: Supplier;
}