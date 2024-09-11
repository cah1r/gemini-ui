import { trigger, transition, style, animate } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  // transition('* <=> *', [
  //   style({ opacity: 0, transform: 'translateX(-100%)' }),
  //   animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
  // ]),

  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('500ms ease-in-out', style({ opacity: 1 }))
  ]),

  // transition('* <=> *', [
  //   style({ opacity: 0, transform: 'scale(0.8)' }),
  //   animate('400ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
  // ]),

]);