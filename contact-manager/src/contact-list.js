// Part 2
import { WebAPI } from './web-api';

import { EventAggregator } from 'aurelia-event-aggregator'; // part 3
import { ContactUpdated, ContactViewed } from './messages'; // part 3

// instantiate classes in your app using inject()
export class ContactList {
  static inject = [WebAPI, EventAggregator];

  constructor(api, ea){
    this.api = api;
    this.contacts = [];

    // part 3
    ea.subscribe(ContactViewed, msg => this.select(msg.contact));
    ea.subscribe(ContactUpdated, msg => {
      let id = msg.contact.id;
      let found = this.contacts.find(x => x.id === id);
      Object.assign(found, msg.contact);
    });
  }
  // gets called after both the view-model and the view are created
  // life-cycle
  created(){
    this.api.getContactList().then(contacts => this.contacts = contacts);
  }

  select(contact){
    this.selectedId = contact.id;
    return true;
  }
}
