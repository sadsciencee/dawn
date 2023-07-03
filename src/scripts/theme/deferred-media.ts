import { qsRequired } from '@/scripts/functions';
import { pauseAllMedia } from '@/scripts/setup';

export class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener('click', this.loadContent.bind(this));
  }

  getTemplate() {
    return qsRequired<HTMLTemplateElement>('template', this);
  }

  loadContent(focus = true) {
    pauseAllMedia();
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      const template = this.getTemplate();
      if (!template || !template.content || !template.content.firstElementChild) {
        throw new Error('No template content found')
      }
      content.appendChild(template.content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', 'true');
      const deferredElement = this.appendChild(qsRequired('video, model-viewer, iframe', content));
      if (focus) deferredElement.focus();
      if (deferredElement instanceof HTMLVideoElement && deferredElement.getAttribute('autoplay')) {
        // force autoplay for safari
        void deferredElement.play();
      }
    }
  }
}
