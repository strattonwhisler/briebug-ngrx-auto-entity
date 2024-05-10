import { FormArray, FormControl, FormGroup } from '@angular/forms';


export type Element<T> = T extends (infer U)[] ? U : never;

export type TypedForm<T, TDate = Date> =
      T extends any[]   ? FormArray<TypedForm<Element<T>, TDate>>
    : T extends string  ? FormControl<string>
    : T extends number  ? FormControl<number>
    : T extends bigint  ? FormControl<bigint>
    : T extends boolean ? FormControl<boolean>
    // : T extends TDate   ? FormControl<TDate>
    : T extends { [key: string]: any } ?
      FormGroup<{
        [K in keyof T]: TypedForm<T[K], TDate>;
      }>
    : FormControl<T>;
