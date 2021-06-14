import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'entity-formly-repeat-section',
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index;" class="row">
      <formly-field class="col" [field]="field"></formly-field>
    </div>
  `,
})
export class EntityRepeatTypeComponent extends FieldArrayType {}
