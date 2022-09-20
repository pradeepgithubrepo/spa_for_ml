import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dialog-confirm',
  template: `
<div class="modal-header">
    <h4 class="modal-title">{{my_modal_title}}</h4>
  </div>
  <div class="modal-body"><pre class="response-class"> 
  {{my_modal_content}}</pre>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
  </div>
  `,
  styles: [`
  ::ng-deep .response-class {
    white-space: pre-wrap;
}
  `]
})
export class DialogConfirm {
  @Input() my_modal_title: any;
  @Input() my_modal_content: any;

  constructor(public modal: NgbActiveModal) { }


}
