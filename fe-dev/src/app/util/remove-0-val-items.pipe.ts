import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rm0valBy'
})
export class Remove0ValItemsPipe implements PipeTransform {

    transform(arr: any[], arg: string): any[] {
        if (!arr || !arg) { return []; }
        return arr.filter((v: any) => Number(v[arg]) !== 0);
    }

}
