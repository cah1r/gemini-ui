import { trigger, transition, style, animate } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 })),
  ]),
]);
