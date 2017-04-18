import {Directive, ElementRef, AfterViewInit, Output, EventEmitter} from '@angular/core';

@Directive({
    selector: '[hammer-gestures]'
})

export class HammerGesturesDirective implements AfterViewInit {

    @Output() onGesture = new EventEmitter();
    static hammerInitialized = false;

    constructor(
        private el: ElementRef
    ) {

    }
 
        
            
                

    ngAfterViewInit() {
        if (!HammerGesturesDirective.hammerInitialized) {

            let hammertime = new Hammer(this.el.nativeElement);
            hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            hammertime.on('swipeup', (ev) => {
                console.log('u');
                this.onGesture.emit('swipeup');
            });
            hammertime.on('swipedown', (ev) => {
                console.log('d');
                this.onGesture.emit('swipedown');
            });
            hammertime.on('swipeleft', (ev) => {
                console.log('l');
                this.onGesture.emit('swipeleft');
            });
            hammertime.on('swiperight', (ev) => {
                console.log('r');
                this.onGesture.emit('swiperight');
            });
            hammertime.on('tap', (ev) => {
                this.onGesture.emit('tap');
            });

            HammerGesturesDirective.hammerInitialized = true;
        }


    }
}