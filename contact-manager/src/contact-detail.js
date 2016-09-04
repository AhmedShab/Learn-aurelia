// part 2
import { WebAPI } from './web-api';
import { areEqual } from './utility';

import { EventAggregator } from 'aurelia-event-aggregator'; // part 3
import { ContactUpdated, ContactViewed } from './messages'; // part 3

export class ContactDetail {
  // EventAggregator ---> add this to part 3
  static inject = [WebAPI, EventAggregator];

  constructor(api, ea){
    this.api = api;
    this.ea = ea
  }

  // is called right before the router is about to activate the component
  // life-cycle method
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getContactDetails(params.id).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));

       this.ea.publish(new ContactViewed(this.contact)); // part 3
    });
  }

  get canSave() {
    return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
  }

  save() {
    this.api.saveContact(this.contact).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));

      this.ea.publish(new ContactUpdated(this.contact)); // part 3
    });
  }

  canDeactivate() {
  //   if (!areEqual(this.originalContact, this.contact)){
  //     return confirm('You have unsaved changes. Are you sure you wish to leave?');
  //   }
  //
  //   return true;
  // }

  // part 3
  if(!areEqual(this.originalContact, this.contact)){
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if(!result){
        this.ea.publish(new ContactViewed(this.contact));
      }

      return result;
    }

    return true;
  }
}
