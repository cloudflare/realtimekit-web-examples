import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RealtimeKitComponentsModule } from '@cloudflare/realtimekit-angular-ui';
import { AppComponent } from './app.component';
import { ManualSubscriptionsDialogComponent } from './manual-subscriptions-dialog.component';

@NgModule({
  declarations: [AppComponent, ManualSubscriptionsDialogComponent],
  imports: [BrowserModule, RealtimeKitComponentsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
