import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HomeModule} from './components/home/home.module'
import {CoreModule} from './core/core.module';
//import { ClassFilterPipe } from './class-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    // ClassFilterPipe,
  ],
  imports: [
    BrowserModule,
    CoreModule.forRoot(),
    HomeModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
