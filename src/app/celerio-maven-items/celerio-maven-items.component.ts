import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-celerio-maven-items',
  templateUrl: './celerio-maven-items.component.html',
  styleUrls: ['./celerio-maven-items.component.css']
})
export class CelerioMavenItemsComponent implements OnInit {

  public celerioForm = new  FormGroup({});
  model: any = {entityConfigs: []};
  showForm = false;
  parsedObject: any

  constructor(protected fb: FormBuilder, private sharedService: SharedService) {

  }

  getColumnConfigs(columnConfigs: any[]) {
    return columnConfigs.map(columnConfig => this.fb.group({
      columnName: [columnConfig.name], //[{value: columnConfig.name, disabled: true}, Validators.required],
      fieldName: [this.snakeToCamelCase(columnConfig.name), Validators.required],
      label: [this.snakeToCamelCase(columnConfig.name), Validators.required],
      formField: [true],
      searchField: [true],
      searchResult: [true],
      version: [],
      displayOrder: [''],
      sharedEnumName: [''],
      type: [''],
      mappedType: [''],
      oneToMany: [],
      bidirectional: [],
      var: [],
      elementVar: []
    }));
  }

  get entityConfig() {
    return ( < FormArray > this.celerioForm.get('entityConfig')).controls;
  }

  getColumnConfigsFor(index: number) {
    return ( < FormArray > ( < FormArray > this.celerioForm.get('entityConfig')).controls[index].get('columnConfigs')).controls;
  }

  getEntityConfig() {
    if (!this.parsedObject) return;

    return this.parsedObject.metadata.tables.table.map( (table: any) => this.fb.group({
      tableName: [table.name],//[{value: table.name, disabled: true}, Validators.required],
      entityName: [this.snakeToPascalCase(table.name), Validators.required],
      sequenceName: ['SEQ_' + table.name, Validators.required],
      columnConfigs: this.fb.array(this.getColumnConfigs(table.columns.column)),
    }));
  }

  ngOnInit(): void {
    this.sharedService.currentData.subscribe(data => {
      this.parsedObject = data;
      this.createFields();
    });
  }

  private createFields() {
    this.showForm = false;
    console.log(this.parsedObject)
    if (this.parsedObject) {
      this.celerioForm = this.fb.group({
        rootPackage: ['', Validators.required],
        applicationName: ['', Validators.required],
        schemaName: ['', Validators.required],
        entityConfig: this.fb.array(this.getEntityConfig())
      });
      this.showForm = true;
    }

  }

  private createHeaderFields(parsedObject: any) {
    const headerFields = {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-4',
          type: 'input',
          key: 'rootPackage',
          templateOptions: {
            label: 'Package',
          },
        },
        {
          className: 'col-4',
          type: 'input',
          key: 'applicationName',
          templateOptions: {
            label: 'Application Name',
          },
        },
        {
          className: 'col-4',
          type: 'input',
          key: 'schema',
          defaultValue: parsedObject.metadata.jdbcConnectivity.schemaName,
          templateOptions: {
            label: 'Schema',
          },
        },
      ],
    };

    return headerFields;
  }

  private createEntitiesFields(parsedObject: any) {
    const entitiesConfig = {
      key: 'entityConfigs',
      type: 'entity-repeat',
      fieldArray: {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-sm-4',
            type: 'input',
            key: 'tableName',
            templateOptions: {
              label: 'Table Name',
              required: true,
            },
          },
          {
            type: 'input',
            key: 'entityName',
            className: 'col-sm-4',
            templateOptions: {
              label: 'Entity Name',
              required: true,
            },
          },
          {
            type: 'input',
            key: 'sequenceName',
            className: 'col-sm-4',
            templateOptions: {
              label: 'Sequence Name:',
              required: true,
            },
          },
        ],
      }
    }
    console.log('OBJ', parsedObject)
    parsedObject.metadata.tables.table.forEach((element: any) => {
      this.model.entityConfigs.push({tableName: element.name, entityName: this.snakeToPascalCase(element.name), sequenceName: 'SEQ_' + element.name})
    });

    console.log('MODEL', this.model.entityConfigs)

    return entitiesConfig;

  }

  private snakeToPascalCase(str: any) {
    return this.capitalizeFirstLetter(this.snakeToCamelCase(str));
  }

  private snakeToCamelCase(str: any) {
    return str ? str
    .split("_")
    .reduce(
      (res: string, word: string, i: number) =>
        i === 0
          ? word.toLowerCase()
          : `${res}${word.charAt(0).toUpperCase()}${word
              .substr(1)
              .toLowerCase()}`,
      "") : "";
  }

  private capitalizeFirstLetter(str: any) {
    return (str && str[0].toUpperCase() + str.slice(1)) || "";
  }

  submit(event: any) {
    alert(JSON.stringify(event));
  }

}
