import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-celerio-maven-items',
  templateUrl: './celerio-maven-items.component.html',
  styleUrls: ['./celerio-maven-items.component.css']
})
export class CelerioMavenItemsComponent implements OnInit {

  form = new FormGroup({});
  model: any = {entityConfigs: []};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(private sharedService: SharedService) {

  }

  ngOnInit(): void {
    this.sharedService.currentData.subscribe(data => {
      this.createFields(data);
    });
  }

  private createFields(parsedObject: any) {
    this.fields = [];
    if (parsedObject) {

      this.fields.push(this.createHeaderFields(parsedObject));
      this.fields.push(this.createEntitiesFields(parsedObject));
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
    return this.capitalizeFirstLetter(str ? str
    .split("_")
    .reduce(
      (res: string, word: string, i: number) =>
        i === 0
          ? word.toLowerCase()
          : `${res}${word.charAt(0).toUpperCase()}${word
              .substr(1)
              .toLowerCase()}`,
      "") : "");
  }

  private capitalizeFirstLetter(str: any) {
    return (str && str[0].toUpperCase() + str.slice(1)) || "";
  }

  submit() {
    alert(JSON.stringify(this.model));
  }

}
