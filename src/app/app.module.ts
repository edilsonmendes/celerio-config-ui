import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { MetadataXmlInputComponent } from './metadata-xml-input/metadata-xml-input.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CelerioMavenItemsComponent } from './celerio-maven-items/celerio-maven-items.component';
import { EntityRepeatTypeComponent } from './celerio-maven-items/entity-repeat-type.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { Bootstrap4FrameworkModule } from '@ajsf/bootstrap4';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MetadataXmlInputComponent,
    CelerioMavenItemsComponent,
    EntityRepeatTypeComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MonacoEditorModule.forRoot(),
    FormlyModule.forRoot({
      extras: { lazyRender: true },
      types: [
        { name: 'entity-repeat', component: EntityRepeatTypeComponent },
      ],
    }),
    FormlyBootstrapModule,
    Bootstrap4FrameworkModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
