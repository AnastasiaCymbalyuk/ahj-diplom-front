/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
import Prism from 'prismjs';
import { mdConvert } from 'md-converter';
import { v4 as uuidv4 } from 'uuid';
import RenderMsg from './RenderMsg';
import dateMsg from './dateMsg';

export default class WidgetCtrl {
  constructor(wdg) {
    this.wdg = wdg;
    this.burger = document.querySelector('.btn_burger');
    this.menuBar = document.querySelector('.box_media_bar');
    this.boxChat = document.querySelector('.box_chat');
    this.btnEmoji = document.querySelector('.btn_add_emoji');
    this.boxEmoji = document.querySelector('.box_emoji');
    this.inpText = document.querySelector('.inp');
    this.chat = document.querySelector('.chat');
    this.inpFile = document.querySelector('.inp_add_media');
    this.chatScroll = document.querySelector('.container_chat');
    this.favourites = document.querySelector('.favourite_box');
  }

  init() {
    this.burger.addEventListener('click', this.onBurgerClick.bind(this));
    this.btnEmoji.addEventListener('click', this.onEmojiClick.bind(this));
    this.inpText.addEventListener('keypress', this.onInpKeyUp.bind(this));
    this.boxEmoji.addEventListener('click', this.onEmojiAddClick.bind(this));
    this.chat.addEventListener('dragover', this.onDragoverChat.bind(this));
    this.chat.addEventListener('drop', this.onDropChat.bind(this));
    this.inpFile.addEventListener('change', this.onChangeFile.bind(this));
    this.menuBar.addEventListener('click', this.onClickList.bind(this));
    this.chatScroll.addEventListener('scroll', this.onScrollChat.bind(this));
    this.chat.addEventListener('click', this.onClickFavour.bind(this));
  }

  // добавление в избранное
  onClickFavour(e) {
    e.preventDefault();
    if (e.target.closest('.favourite_box')) {
      const idSerch = e.target.closest('.message');
      e.target.classList.toggle('favourite_active');
      this.wdg.submitCheckFavour(idSerch.dataset.id);
    }
  }

  // скролл запускающий загрузку по 10 сообщений
  onScrollChat() {
    if (this.wdg.list === null) {
      const lastEl = this.chat.firstElementChild.getBoundingClientRect().bottom;
      const lastHeig = this.chat.firstElementChild.clientHeight + 50;
      if (lastEl > lastHeig) {
        this.wdg.submitList('scroll');
      }
    }
  }

  // правое меню
  onBurgerClick() {
    if (this.burger.classList.contains('active_close_burger')) {
      this.menuBar.style.display = 'none';
      this.boxChat.style.width = '100%';
    } else {
      this.menuBar.style.display = 'block';
      this.boxChat.style.width = '75%';
    }
    this.burger.classList.toggle('active_close_burger');
    this.burger.classList.toggle('active_burger');
  }

  onClickList(e) {
    e.preventDefault();
    if (e.target.classList.contains('link_burger_menu')) {
      this.chat.innerHTML = '';
      if (e.target.classList.contains('link_img')) {
        this.wdg.submitList('img');
        this.wdg.list = 'img';
      }
      if (e.target.classList.contains('link_audio')) {
        this.wdg.submitList('audio');
        this.wdg.list = 'audio';
      }
      if (e.target.classList.contains('link_video')) {
        this.wdg.submitList('video');
        this.wdg.list = 'video';
      }
      if (e.target.classList.contains('link_application')) {
        this.wdg.submitList('application');
        this.wdg.list = 'application';
      }
      if (e.target.classList.contains('link_link')) {
        this.wdg.submitList('link');
        this.wdg.list = 'link';
      }
      if (e.target.classList.contains('link_favourites')) {
        this.wdg.submitList('favourites');
        this.wdg.list = 'favourites';
      }
      this.scrollBottom();
    }
    return false;
  }

  // добавление файлов и медиа
  onChangeFile() {
    const file = this.inpFile.files && this.inpFile.files[0];
    this.onLoadReader(file);
  }

  // dnd
  onDragoverChat(e) {
    e.preventDefault();
  }

  onDropChat(e) {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    this.onLoadReader(file);
  }

  // reader загрузка файлов и сохранение
  onLoadReader(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      const time = dateMsg();
      const id = uuidv4();
      new RenderMsg('beforeEnd', {
        id, chat: this.chat, value: e.target.result, time, type: file.type, name: file.name, favourites: false,
      }).render();
      this.scrollBottom();
      this.wdg.submitMsg(id, e.target.result, time, file.type, false, file.name, false);
    });
    reader.readAsDataURL(file);
  }

  // добавление эмоджи
  onEmojiClick() {
    if (!this.boxEmoji.classList.contains('active_box_emoji')) {
      this.boxEmoji.style.display = 'block';
    } else {
      this.boxEmoji.style.display = 'none';
    }
    this.boxEmoji.classList.toggle('active_box_emoji');
  }

  onEmojiAddClick(event) {
    if (event.target.classList.contains('emoji')) {
      this.inpText.value = `${this.inpText.value}${event.target.textContent}`;
    }
  }

  // сохранение сообщений и отправка на сервер
  onInpKeyUp(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.inpText.value !== '') {
        if (/@chaos:/g.test(this.inpText.value)) {
          let comandBot;
          let value = null;
          if (/погода/g.test(this.inpText.value)) {
            comandBot = 'weather';
          } else if (/удалить все/g.test(this.inpText.value)) {
            comandBot = 'delete';
          } else if (/количество файлов/g.test(this.inpText.value)) {
            comandBot = 'number';
          } else if (/поиск [0-9]{2}.[0-9]{2}.[0-9]{4}/g.test(this.inpText.value)) {
            comandBot = 'date';
            value = this.inpText.value.match(/[0-9]{2}.[0-9]{2}.[0-9]{4}/g).join();
          } else if (/поиск '(.*?)'/g.test(this.inpText.value)) {
            comandBot = 'word';
            value = this.inpText.value.match(/(?<=["'])([^"']+)/g).join();
          } else {
            alert('введена неверная команда');
            return;
          }
          this.wdg.submitComBot(comandBot, value);
        } else {
          const time = dateMsg();
          const id = uuidv4();
          const httpsChek = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gim;
          let link;
          if (httpsChek.test(this.inpText.value)) {
            link = true;
            this.inpText.value = this.inpText.value.replace(httpsChek, '<a class="link_in_msg" href="$1" target="_blank">$1</a>');
          } else {
            link = false;
          }
          if (/(?<=[```])([^```]+)/g.test(this.inpText.value)) {
            this.inpText.value = mdConvert(this.inpText.value);
          }
          new RenderMsg('beforeEnd', {
            id, chat: this.chat, value: this.inpText.value, time, type: 'text', name: null, favourites: false,
          }).render();
          this.scrollBottom();
          Prism.highlightAll();
          if (this.boxEmoji.classList.contains('active_box_emoji')) {
            this.boxEmoji.style.display = 'none';
            this.boxEmoji.classList.toggle('active_box_emoji');
          }
          this.wdg.submitMsg(id, this.inpText.value, time, 'text', link, null, false);
          this.inpText.value = '';
        }
      }
    }
  }

  // авто прокрутка скролла
  scrollBottom() {
    this.chatScroll.scrollTop = this.chatScroll.scrollHeight;
  }
}
