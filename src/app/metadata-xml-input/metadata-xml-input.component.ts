import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as parser from 'fast-xml-parser'
import * as xmlBuilder2 from 'xmlbuilder2'
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-metadata-xml-input',
  templateUrl: './metadata-xml-input.component.html',
  styleUrls: ['./metadata-xml-input.component.css']
})
export class MetadataXmlInputComponent implements OnInit {

  editorOptions = {
    theme: 'vs-dark',
    language: 'xml',
    fontSize: 11,
    minimap: {
      enabled: false,
    },
    automaticLayout: true
  };

  private options = {
    attributeNamePrefix : "",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : true,
    parseNodeValue : true,
    parseAttributeValue : true
  }

  public metadataForm: FormGroup;

  constructor(protected fb: FormBuilder, private sharedService: SharedService) {
    this.metadataForm = this.fb.group({
      metadata: [null, [Validators.required,]]
    });

    this.metadataForm.get('metadata')?.valueChanges.subscribe( value => this.parseMetadataXML(value));
  }

  ngOnInit(): void {

  }

  parseMetadataXML(xml: string) {
    try {
      if (xml) {
        const pasedObject = parser.parse(xml, this.options);
        this.sharedService.changeData(pasedObject);

        const obj = xmlBuilder2.convert(xml, { format: "object" });
        console.log('xmlBuilder2', obj);
      }
    } catch (error) {

    }
  }

}
