import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';

import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['',[Validators.required]],
    pais    : ['',[Validators.required]],
    vecino:   ['',[Validators.required]],

  })

  //llenar selectores

  regiones:  string[]=[];
  paises: PaisSmall[]=[];
  // vecinos:   string[]=[];
  vecinos: PaisSmall[]=[];

  //UI
  cargando:boolean = false


  constructor(private fb: FormBuilder,
              private paisesService: PaisesService,
              ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    this.miFormulario.get('region')?.valueChanges    
    .pipe( 
      tap(_ => {
        this.miFormulario.get('pais')?.reset('');
        this.cargando= true;
      }),
      switchMap( region =>this.paisesService.getPaisesPorRegion(region))
    )
      .subscribe(paises=>{
        this.cargando= false;
        console.log(paises);
        this.paises = paises;
    })
        
    
    //Cuando cambia el país:
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap(()=>{
            this.vecinos = [];
            this.miFormulario.get('vecino')?.reset('');
            this.cargando=true;
          }),
          switchMap(codigo=> this.paisesService.getPaisPorCode(codigo)),
          switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!) )
          )
        .subscribe(paises =>{
          this.cargando=false
          console.log(paises);
          
          this.vecinos = paises;
          
        })
              


  }

  guardar(){
    console.log(this.miFormulario.value);
    
  }
}
