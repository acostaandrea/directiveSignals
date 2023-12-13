import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[customLabel]',
  standalone: false,
})
export class CustomLabelDirective implements OnInit {

  private htmlElement?: ElementRef<HTMLElement>;
  private _color: string = 'red';
  private _errors?: ValidationErrors | null;

  @Input() set color(value:string){
    this._color = value;
    this.setStyle();
  }

  @Input() set errors(value: ValidationErrors | null | undefined) {
    this._errors = value;
    this.setErrorMessages();

  }

  constructor(private el: ElementRef<HTMLElement>) {
    this.htmlElement = el;
  }
  ngOnInit(): void {
    this.setStyle();
  }

  setStyle(): void {
    if (this.htmlElement) {
      this.htmlElement.nativeElement.style.color = this._color;
    }
  }

  setErrorMessages(): void {
    if (!this.htmlElement) return;
    if (!this._errors) {
      this.htmlElement.nativeElement.innerHTML = '';
      return;
    }

    const errorMessages: string[] = [];

    if (this._errors['required']) {
      errorMessages.push('Campo requerido.');
    }

    if (this._errors['minlength']) {
      const min = this._errors['minlength']['requiredLength'];
      const currentLength = this._errors['minlength']['actualLength'];
      errorMessages.push(`El campo debe tener al menos ${min} caracteres, tiene ${currentLength}.`);
    }

    if (this._errors['email']) {
      errorMessages.push('El campo debe ser un email.');
    }

    // Mostrar todos los mensajes de error
    this.htmlElement.nativeElement.innerHTML = errorMessages.map(message => `<div>*${message}</div>`).join('');
  }
 }
