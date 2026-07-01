import { Component, Input } from '@angular/core';
import { WatermarkConfig } from '../types';

@Component({
  selector: 'app-watermark',
  template: '<div [ngStyle]="watermarkStyle"></div>',
})
export class WatermarkComponent {
  @Input() config!: WatermarkConfig;

  get watermarkStyle(): { [key: string]: string } {
    const { url, position, size, opacity } = this.config;

    let width = 'auto';
    let height = 'auto';
    if (size.width) {
      width = `${size.width}px`;
    }
    if (size.height) {
      height = `${size.height}px`;
    }

    return {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      'background-image': `url(${url})`,
      'background-size': `${width} ${height}`,
      'background-position': position,
      'background-repeat': 'no-repeat',
      'background-origin': 'content-box',
      opacity: `${opacity}`,
      padding: '2vh 2vw',
      'z-index': '1000',
      'box-sizing': 'border-box',
    };
  }
}
