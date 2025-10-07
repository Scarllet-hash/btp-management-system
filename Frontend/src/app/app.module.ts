import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    AppComponent // <-- Import here, not in declarations
  ],
  // REMOVE declarations: [AppComponent]
  bootstrap: [AppComponent]
})
export class AppModule { }