import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SharedService } from '../shared.service';
import * as xmlBuilder2 from 'xmlbuilder2'


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

  constructor(protected fb: FormBuilder, private sharedService: SharedService, private http: HttpClient) {

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
    const tableObj = this.parsedObject.metadata.tables.table;

    return Array.isArray(tableObj) ? tableObj.map( (table: any) => this.fb.group({
      tableName: [table.name],//[{value: table.name, disabled: true}, Validators.required],
      entityName: [this.snakeToPascalCase(table.name), Validators.required],
      sequenceName: ['SEQ_' + table.name, Validators.required],
      columnConfigs: this.fb.array(this.getColumnConfigs(table.columns.column)),
    })) : [this.fb.group({
      tableName: [tableObj.name],//[{value: table.name, disabled: true}, Validators.required],
      entityName: [this.snakeToPascalCase(tableObj.name), Validators.required],
      sequenceName: ['SEQ_' + tableObj.name, Validators.required],
      columnConfigs: this.fb.array(this.getColumnConfigs(tableObj.columns.column)),
    })];
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

  generateCelerioXml() {
    this.http.get('assets/celerio-template.xml', {responseType: 'text'})
            .subscribe(xmlContent => {
              const doc = xmlBuilder2.create(xmlContent);
              const celerioTag = doc
                .root() // <celerio>
                .first() // <configuration>
                .att('', 'rootPackage', 'package').att('', 'applicationName', 'appName');

              const sequencesTag = celerioTag
                .first() // skip comment
                .next() // <tables>
                .next() // skip comment
                .next(); // <sequences>

              sequencesTag.first() // <sequences>
                  .att('', 'schema', 'DBOUVID01');


              const entityConfisTag = celerioTag
                .next() // skip comment
                .next() ;

              const entityConfig = entityConfisTag.ele('entityConfig');
              entityConfig.att('tableName', 'ANEXO');
              entityConfig.att('entityName', 'Anexo');
              entityConfig.att('sequenceName', 'SEQ_ANE');
              entityConfig.att('label', 'Anexo');
              const columnConfigs = entityConfig.ele('columnConfigs');
              const columConfig = columnConfigs.ele('columnConfig');
              columConfig.att('columnName', 'ANE_ID');
              columConfig.att('fieldName', 'id');
              console.log(entityConfisTag.toString())
              console.log(doc.end({ prettyPrint: true }))
            });
  }

}
