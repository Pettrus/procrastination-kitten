import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IpcService } from './ipc.service';

import { NgPipesModule } from 'ngx-pipes';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgPipesModule,
    ChartsModule
  ],
  providers: [
    IpcService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
