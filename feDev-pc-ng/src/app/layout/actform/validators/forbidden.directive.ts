import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function forbiddenValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? {
            forbidden: { value: control.value }
        } : null;
    };
}

@Directive({
    selector: '[appForbidden]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true }]
})
export class ForbiddenValidatorDirective implements Validator {
    @Input('appForbidden') forbidden: string;

    validate(control: AbstractControl): { [key: string]: any } | null {
        return this.forbidden ? forbiddenValidator(new RegExp(this.forbidden, 'i'))(control) : null;
    }
}
