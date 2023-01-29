/* eslint-disable no-alert */
export default class RenderMsg {
  constructor(where, msg) {
    this.where = where;
    this.msg = msg;
    if (this.msg.favourites === true) {
      this.class = 'favourite_active';
    } else {
      this.class = '';
    }
  }

  render() {
    if (this.msg.type === 'text') {
      this.msg.chat.insertAdjacentHTML(this.where, `
        <div class="message" data-id="${this.msg.id}">
          <p>
            ${this.msg.value}
          </p>
          <div class="favourite_box ${this.class}" data-favourites="${this.msg.favourites}"></div>
          <span class="date">${this.msg.time}</span>
        </div>
        `);
    } else if (this.msg.type === 'botMsg') {
      this.msg.chat.insertAdjacentHTML(this.where, `
          <div class="message_bot">
            <p>
              ${this.msg.value}
            </p>
            <span class="date">${this.msg.time}</span>
          </div>
        `);
    } else if (/image/g.test(this.msg.type)) {
      this.msg.chat.insertAdjacentHTML(this.where, `
          <div class="message" data-id="${this.msg.id}">
            <img class="preview-image" src="${this.msg.value}">
            <a class="download_link" href="${this.msg.value}" rel="noopener" download>${this.msg.name}</a>
            <div class="favourite_box ${this.class}" data-favourites="${this.msg.favourites}"></div>
            <span class="date">${this.msg.time}</span>
          </div>
        `);
    } else if (/application/g.test(this.msg.type) || /text\//g.test(this.msg.type)) {
      this.msg.chat.insertAdjacentHTML(this.where, `
          <div class="message" data-id="${this.msg.id}">
            <a class="preview_file" href="${this.msg.value}" rel="noopener" download>${this.msg.name}</a>
            <div class="favourite_box ${this.class}" data-favourites="${this.msg.favourites}"></div>
            <span class="date">${this.msg.time}</span>
          </div>
        `);
    } else if (/video/g.test(this.msg.type)) {
      this.msg.chat.insertAdjacentHTML(this.where, `
          <div class="message" data-id="${this.msg.id}">
            <video class="preview-video" src="${this.msg.value}" controls></video>
            <a class="download_link" href="${this.msg.value}" rel="noopener" download>${this.msg.name}</a>
            <div class="favourite_box ${this.class}" data-favourites="${this.msg.favourites}"></div>
            <span class="date">${this.msg.time}</span>
          </div>
        `);
    } else if (/audio/g.test(this.msg.type)) {
      this.msg.chat.insertAdjacentHTML(this.where, `
          <div class="message" data-id="${this.msg.id}">
            <audio class="preview-video" src="${this.msg.value}" controls></audio>
            <a class="download_link" href="${this.msg.value}" rel="noopener" download>${this.msg.name}</a>
            <div class="favourite_box ${this.class}" data-favourites="${this.msg.favourites}"></div>
            <span class="date">${this.msg.time}</span>
          </div>
        `);
    } else {
      alert('Неизвестный тип файла');
    }
  }
}
