import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as parser from 'fast-xml-parser'
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-metadata-xml-input',
  templateUrl: './metadata-xml-input.component.html',
  styleUrls: ['./metadata-xml-input.component.css']
})
export class MetadataXmlInputComponent implements OnInit {

  private options = {
    attributeNamePrefix : "",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : true,
    parseNodeValue : true,
    parseAttributeValue : true,
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
      const pasedObject = parser.parse(xml, this.options);
      this.sharedService.changeData(pasedObject);
    } catch (error) {

    }
  }

}
