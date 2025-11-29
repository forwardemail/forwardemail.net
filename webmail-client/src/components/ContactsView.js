import ko from 'knockout';
import { Remote } from '../utils/remote';
import { Local } from '../utils/storage';

// Helper to generate vCard content from contact data
function generateVCard(contact) {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];

  if (contact.name) {
    lines.push(`FN:${contact.name}`);
  }

  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${contact.email}`);
  }

  if (contact.phone) {
    lines.push(`TEL:${contact.phone}`);
  }

  if (contact.address) {
    // Format: ADR;TYPE=HOME:;;street;city;state;postal;country
    lines.push(`ADR;TYPE=HOME:;;${contact.address};;;;`);
  }

  if (contact.birthday) {
    // Format: BDAY:YYYY-MM-DD
    lines.push(`BDAY:${contact.birthday}`);
  }

  if (contact.notes) {
    lines.push(`NOTE:${contact.notes}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

// Helper to parse vCard content
function parseVCard(vcardContent) {
  if (!vcardContent) return {};

  const lines = vcardContent.split(/\r?\n/);
  const parsed = {};

  for (const line of lines) {
    if (line.startsWith('NOTE:')) {
      parsed.notes = line.substring(5);
    } else if (line.startsWith('BDAY:')) {
      parsed.birthday = line.substring(5);
    } else if (line.startsWith('ADR')) {
      // Extract address from ADR field
      const addrPart = line.split(':')[1];
      if (addrPart) {
        const parts = addrPart.split(';');
        // Get street address (3rd component in ADR format)
        parsed.address = parts[2] || '';
      }
    }
  }

  return parsed;
}

export class ContactsView {
  constructor() {
    this.contacts = ko.observableArray([]);
    this.selectedContact = ko.observable(null);
    this.selectedDraft = ko.observable(null);
    this.isEditing = ko.observable(false);
    this.loading = ko.observable(false);
    this.error = ko.observable('');
    this.query = ko.observable('');
    this.navigate = null;
    this.email = ko.observable(Local.get('email') || '');
    this.toasts = null;

    this.modalVisible = ko.observable(false);
    this.modalMode = ko.observable('create'); // create | edit
    this.modalId = ko.observable(null);
    this.modalName = ko.observable('');
    this.modalEmail = ko.observable('');
    this.modalPhone = ko.observable('');
    this.modalNotes = ko.observable('');
    this.modalSaving = ko.observable(false);
    this.modalError = ko.observable('');

    this.confirmVisible = ko.observable(false);
    this.confirmTarget = null;
  }

  filteredContacts = ko.pureComputed(() => {
    const q = (this.query() || '').toLowerCase();
    if (!q) return this.contacts();
    return this.contacts().filter((c) => {
      return (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    });
  });

  selectContact = (contact) => {
    this.selectedContact(contact);
    this.isEditing(false);
    if (contact) this.selectedDraft(this.cloneContact(contact));
  };

  async load() {
    this.loading(true);
    this.error('');
    try {
      const res = await Remote.request('Contacts', { limit: 500 });
      const list = Array.isArray(res) ? res : res?.Result || res?.contacts || [];
      const mapped = (list || []).map((c) => {
        // Parse vCard content for additional fields
        const vcardData = parseVCard(c.content);

        return {
          id: c.id || c.contact_id || c.uid || c.Id,
          name: c.full_name || c.name || c.FullName || '',
          email:
            (c.emails && c.emails[0]?.value) ||
            (c.Emails && c.Emails[0]?.value) ||
            c.email ||
            '',
          phone:
            (c.phone_numbers && c.phone_numbers[0]?.value) ||
            (c.Phones && c.Phones[0]?.value) ||
            (c.phones && c.phones[0]?.value) ||
            '',
          address: vcardData.address || '',
          birthday: vcardData.birthday || '',
          notes: vcardData.notes || '',
          raw: c
        };
      });
      this.contacts(mapped);
      if (!this.selectedContact() && mapped.length) this.selectedContact(mapped[0]);
    } catch (error) {
      this.error(error?.message || 'Unable to load contacts.');
    } finally {
      this.loading(false);
    }
  }

  startNewContact = () => {
    this.modalMode('create');
    this.modalId(null);
    this.modalName('');
    this.modalEmail('');
    this.modalPhone('');
    this.modalNotes('');
    this.modalError('');
    this.modalVisible(true);
  };

  startMail = (contact) => {
    if (!contact?.email || !this.navigate) return;
    this.navigate('/mailbox#compose=' + encodeURIComponent(contact.email));
  };

  addEvent = (contact) => {
    if (!this.navigate) return;
    const email = contact?.email || '';
    this.navigate('/calendar#addevent=' + encodeURIComponent(email));
  };

  viewEmails = (contact) => {
    if (!this.navigate) return;
    const email = contact?.email || '';
    this.navigate('/mailbox#search=' + encodeURIComponent(email));
  };

  openDeleteConfirm = (contact) => {
    if (!contact) return;
    this.confirmTarget = contact;
    this.confirmVisible(true);
  };

  cancelDelete = () => {
    this.confirmVisible(false);
    this.confirmTarget = null;
  };

  closeModal = () => {
    this.modalVisible(false);
    this.modalError('');
    this.modalSaving(false);
  };

  openEdit = (contact) => {
    if (!contact) return;
    this.isEditing(true);
    this.selectedDraft(this.cloneContact(contact));
  };

  cancelEdit = () => {
    const original = this.selectedContact();
    this.selectedDraft(original ? this.cloneContact(original) : null);
    this.isEditing(false);
  };

  cloneContact(contact) {
    return {
      id: contact.id,
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      address: contact.address || '',
      birthday: contact.birthday || '',
      notes: contact.notes || ''
    };
  };

  async saveContactInline() {
    const draft = this.selectedDraft();
    if (!draft) return;
    const name = (draft.name || '').trim();
    const emailPrimary = draft.email || '';
    if (!emailPrimary) {
      this.error('Email is required.');
      return;
    }
    this.loading(true);
    this.error('');
    try {
      // Generate vCard content with all fields
      const vCardContent = generateVCard({
        name: name,
        email: emailPrimary,
        phone: draft.phone,
        address: draft.address,
        birthday: draft.birthday,
        notes: draft.notes
      });

      const payload = {
        full_name: name,
        emails: emailPrimary ? [{ value: emailPrimary }] : undefined,
        phone_numbers: draft.phone ? [{ value: draft.phone }] : undefined,
        content: vCardContent
      };

      if (draft.id) {
        const id = draft.id;
        const updated = await Remote.request(
          'ContactsUpdate',
          payload,
          { method: 'PUT', pathOverride: `/v1/contacts/${encodeURIComponent(id)}` }
        );

        // Parse vCard from response to get additional fields
        const vcardData = parseVCard(updated?.content);

        this.contacts(
          this.contacts().map((c) =>
            c.id === id
              ? {
                  ...c,
                  name: updated?.full_name || name,
                  email:
                    (updated?.emails && updated.emails[0]?.value) ||
                    updated?.email ||
                    emailPrimary,
                  phone:
                    (updated?.phone_numbers && updated.phone_numbers[0]?.value) ||
                    updated?.phone ||
                    draft.phone ||
                    '',
                  address: vcardData.address || draft.address || '',
                  birthday: vcardData.birthday || draft.birthday || '',
                  notes: vcardData.notes || draft.notes || ''
                }
              : c
          )
        );
        const selected = this.contacts().find((c) => c.id === id);
        if (selected) this.selectedContact(selected);
        this.isEditing(false);
        if (this.toasts) this.toasts.show('Contact updated', 'success');
      } else {
        const created = await Remote.request(
          'ContactsCreate',
          payload,
          { method: 'POST', pathOverride: '/v1/contacts' }
        );

        // Parse vCard from response to get additional fields
        const vcardData = parseVCard(created?.content);

        const mapped = {
          id: created?.id || created?.contact_id || created?.uid || created?.Id,
          name: created?.full_name || name,
          email:
            (created?.emails && created.emails[0]?.value) ||
            created?.email ||
            emailPrimary,
          phone:
            (created?.phone_numbers && created.phone_numbers[0]?.value) ||
            created?.phone ||
            draft.phone ||
            '',
          raw: created,
          address: vcardData.address || draft.address || '',
          birthday: vcardData.birthday || draft.birthday || '',
          notes: vcardData.notes || draft.notes || ''
        };
        this.contacts([mapped, ...this.contacts()]);
        this.selectedContact(mapped);
        this.selectedDraft(this.cloneContact(mapped));
        this.isEditing(false);
        if (this.toasts) this.toasts.show('Contact created', 'success');
      }
    } catch (error) {
      this.error(error?.message || 'Unable to save contact.');
    } finally {
      this.loading(false);
    }
  }

  async deleteContact(contact) {
    if (!contact?.id) return;
    try {
      await Remote.request(
        'ContactsDelete',
        {},
        { method: 'DELETE', pathOverride: `/v1/contacts/${encodeURIComponent(contact.id)}` }
      );
      this.contacts(this.contacts().filter((c) => c.id !== contact.id));
      if (this.selectedContact()?.id === contact.id) this.selectedContact(null);
      if (this.toasts) this.toasts.show('Contact deleted', 'success');
    } catch (error) {
      this.error(error?.message || 'Unable to delete contact.');
      if (this.toasts) this.toasts.show(this.error(), 'error');
    }
    this.cancelDelete();
  }
}
