import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function AtLeastOneCourt(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        if (!Array.isArray(value)) {
            return null;
        }
        
        return value.length > 0 ? null : {noCourts:true};
    }
}