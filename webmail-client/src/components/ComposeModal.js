import ko from 'knockout';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { Remote } from '../utils/remote';
import { Local } from '../utils/storage';
import { sanitizeHtml } from '../utils/sanitize';

export class ComposeModal {
  constructor() {
    this.visible = ko.observable(false);
    this.to = ko.observable('');
    this.cc = ko.observable('');
    this.bcc = ko.observable('');
    this.ccVisible = ko.observable(false);
    this.bccVisible = ko.observable(false);
    this.subject = ko.observable('');
    this.body = ko.observable('');
    this.sending = ko.observable(false);
    this.error = ko.observable('');
    this.success = ko.observable('');
    this.editorView = null;
    this.linkTarget = ko.observable('');
    this.attachments = ko.observableArray([]);
  }

  open = () => {
    this.reset();
    this.initEditor();
    this.visible(true);
  };

  close = () => {
    this.visible(false);
  };

  reset() {
    this.to('');
    this.cc('');
    this.bcc('');
    this.ccVisible(false);
    this.bccVisible(false);
    this.subject('');
    this.body('');
    this.error('');
    this.success('');
    this.sending(false);
    this.attachments([]);
    if (this.editorView) this.editorView.commands.setContent('');
  }

  initEditor() {
    const target = document.querySelector('.fe-rich');
    if (!target) return;
    if (this.editorView) this.editorView.destroy();
    this.editorView = new Editor({
      element: target,
      content: this.body() || '',
      extensions: [
        StarterKit.configure({ heading: false }),
        Underline,
        Highlight,
        Link.configure({ openOnClick: false }),
        Placeholder.configure({
          placeholder: 'Message'
        })
      ],
      onUpdate: ({ editor }) => {
        this.body(editor.getHTML());
      }
    });
  }

  command(fn) {
    if (!this.editorView) return false;
    fn(this.editorView.chain().focus()).run();
    return false;
  }

  toggleBold = () => this.command((c) => c.toggleBold());
  toggleItalic = () => this.command((c) => c.toggleItalic());
  toggleUnderline = () => this.command((c) => c.toggleUnderline());
  toggleStrike = () => this.command((c) => c.toggleStrike());
  toggleBullet = () => this.command((c) => c.toggleBulletList());
  toggleOrdered = () => this.command((c) => c.toggleOrderedList());
  toggleQuote = () => this.command((c) => c.toggleBlockquote());
  toggleCode = () => this.command((c) => c.toggleCodeBlock());
  clearFormatting = () => this.command((c) => c.clearNodes().unsetAllMarks());

  setLink = () => {
    const url = window.prompt('Enter URL');
    if (url === null) return false;
    const safeUrl = url.trim();
    if (safeUrl === '') return this.command((c) => c.unsetLink());
    return this.command((c) => c.setLink({ href: safeUrl }));
  };

  send = () => {
    this.error('');
    this.success('');
    this.sending(true);

    const from = Local.get('email') || '';
    const to = (this.to() || '').trim();
    const cc = (this.cc() || '').trim();
    const bcc = (this.bcc() || '').trim();
    const subject = (this.subject() || '').trim();
    const body = this.editorView ? this.editorView.getHTML() : this.body() || '';

    if (!to) {
      this.error('Please enter a recipient.');
      this.sending(false);
      return false;
    }

    const parsedTo = this.parseRecipients(to);
    const parsedCc = this.parseRecipients(cc);
    const parsedBcc = this.parseRecipients(bcc);

    // Build nodemailer-like payload per API spec (createMessage)
    const payload = {
      from,
      to: parsedTo,
      ...(parsedCc.length ? { cc: parsedCc } : {}),
      ...(parsedBcc.length ? { bcc: parsedBcc } : {}),
      subject,
      text: body,
      html: sanitizeHtml(body),
      folder: 'Sent Mail',
      ...(this.attachments().length
        ? {
            attachments: this.attachments().map((att) => ({
              filename: att.name,
              content: att.content,
              contentType: att.contentType
            }))
          }
        : {})
    };

    Remote.request(
      'Message',
      payload,
      { method: 'POST' }
    )
      .then(() => {
        this.success('Message queued.');
        this.sending(false);
        setTimeout(() => {
          this.close();
        }, 800);
      })
      .catch((error) => {
        this.error(error?.message || 'Unable to send message.');
        this.sending(false);
      });
    return false;
  };

  parseRecipients(value) {
    return (value || '')
      .split(/[,;\s]+/)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  triggerFilePicker = () => {
    const input = document.querySelector('.fe-attach-input');
    if (input) input.click();
  };

  onFilesSelected = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          const base64 = result.split(',')[1] || '';
          this.attachments.push({
            name: file.name,
            size: file.size,
            contentType: file.type || 'application/octet-stream',
            content: base64
          });
        }
      };
      reader.readAsDataURL(file);
    });
    // reset input so same file can be re-selected
    event.target.value = '';
  };

  removeAttachment = (att) => {
    this.attachments.remove(att);
  };

  showCc = () => this.ccVisible(true);
  showBcc = () => this.bccVisible(true);
}
