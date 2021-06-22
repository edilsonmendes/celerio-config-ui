import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SharedService } from '../shared.service';
import * as xmlBuilder2 from 'xmlbuilder2'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  generatedXml: string = '';

  editorOptions = {
    theme: 'vs-dark',
    language: 'xml',
    fontSize: 11,
    minimap: {
      enabled: false,
    },
    automaticLayout: true
  };

  constructor(protected fb: FormBuilder,
    private sharedService: SharedService,
    private http: HttpClient,
    private modalService: NgbModal) {

  }

  getColumnConfigs(columnConfigs: any[]) {
    return columnConfigs.map(columnConfig => this.fb.group({
      columnName: [columnConfig.name], //[{value: columnConfig.name, disabled: true}, Validators.required],
      fieldName: [this.snakeToCamelCase(columnConfig.name), Validators.required],
      label: [this.snakeToCamelCase(columnConfig.name), Validators.required],
      formField: [true],
      searchField: [true],
      searchResult: [true],
      version: [''],
      displayOrder: [''],
      sharedEnumName: [''],
      type: [''],
      mappedType: [''],
      oneToMany: [false],
      bidirectional: [false],
      var: [''],
      elementVar: ['']
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

  generateCelerioXml(contentModal: any) {
    console.log(JSON.stringify(this.celerioForm.value))

    const celerioFormValues = this.celerioForm.value;

    this.http.get('assets/celerio-template.xml', {responseType: 'text'})
            .subscribe(xmlContent => {
              const doc = xmlBuilder2.create(xmlContent);
              const celerioTag = doc
                .root() // <celerio>
                .first() // <configuration>
                  .att('', 'rootPackage', celerioFormValues.rootPackage)
                  .att('', 'applicationName', celerioFormValues.applicationName);

              const sequencesTag = celerioTag
                .first() // skip comment
                .next() // <tables>
                .next() // skip comment
                .next(); // <sequences>

              sequencesTag.first() // <sequences>
                  .att('', 'schema', celerioFormValues.schemaName);


              const entityConfigsTag = celerioTag
                .next() // skip comment
                .next() ;

              celerioFormValues.entityConfig.forEach((entityConfig: any) => {
                const entityConfigElement = entityConfigsTag.ele('entityConfig');
                entityConfigElement.att('tableName', entityConfig.tableName);
                entityConfigElement.att('entityName', entityConfig.entityName);
                entityConfigElement.att('sequenceName', entityConfig.sequenceName);
                entityConfigElement.att('label', entityConfig.entityName);

                const columnConfigs = entityConfigElement.ele('columnConfigs');

                entityConfig.columnConfigs.forEach((columnConfig: any) => {
                  const columnConfigElement = columnConfigs.ele('columnConfig');
                  columnConfigElement.att('columnName', columnConfig.columnName);
                  columnConfigElement.att('fieldName', columnConfig.fieldName);
                  columnConfigElement.att('label', columnConfig.label);
                  columnConfigElement.att('formField', columnConfig.formField);
                  columnConfigElement.att('searchField', columnConfig.searchField);
                  columnConfigElement.att('searchResult', columnConfig.searchResult);
                  if (columnConfig.displayOrder) {
                    columnConfigElement.att('displayOrder', columnConfig.displayOrder);
                  }
                  if (columnConfig.version) {
                    columnConfigElement.att('version', columnConfig.version);
                  }
                  if (columnConfig.sharedEnumName) {
                    columnConfigElement.att('sharedEnumName', columnConfig.sharedEnumName);
                  }
                  if (columnConfig.type) {
                    columnConfigElement.att('type', columnConfig.type);
                  }
                  if (columnConfig.mappedType) {
                    columnConfigElement.att('mappedType', columnConfig.mappedType);
                  }
                  if (columnConfig.oneToMany) {
                    if (columnConfig.bidirectional) {
                      columnConfigElement.att('associationDirection', 'BIDIRECTIONAL');
                    }

                    const oneToManyElement = columnConfigElement.ele('oneToManyConfig');
                    oneToManyElement.att('var', columnConfig.var);
                    if (columnConfig.elementVar) {
                      oneToManyElement.att('elementVar', columnConfig.elementVar);
                    }
                  }
                });
              });

              this.generatedXml = doc.end({ prettyPrint: true });
              this.openModal(contentModal);
            });
  }

  openModal(contentModal: any) {
    this.modalService.open(contentModal, { size: 'xl', centered: true });
  }

}
