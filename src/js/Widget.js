/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
import Prism from 'prismjs';
import WidgetCtrl from './WidgetCtrl';
import RenderMsg from './RenderMsg';
import dateMsg from './dateMsg';

export default class Widget {
  constructor() {
    this.user = 'user123';
    this.server = 'wss://ahj-diplom-back.onrender.com/ws';
    this.chat = document.querySelector('.chat');
    this.ws = new WebSocket(this.server);
    this.lastId = null;
    this.minInd = null;
    this.list = null;
  }

  // получение сообщений от сервера
  init() {
    const wdCtrl = new WidgetCtrl(this);
    wdCtrl.init();
    this.ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      const chat = document.querySelector('.chat');
      if (msg.arr) {
        chat.innerHTML = '';
        const minIndx = msg.arr.length - 10;
        msg.arr.forEach((item, index) => {
          if (index >= minIndx) {
            if (index === minIndx) {
              this.lastId = item.id;
            }
            new RenderMsg('beforeEnd', {
              id: item.id, chat, value: item.text, time: item.time, type: item.type, name: item.name, favourites: item.favourites,
            }).render();
            wdCtrl.scrollBottom();
          }
          Prism.highlightAll();
        });
      }
      if (msg.messages) {
        chat.innerHTML = '';
        msg.messages.forEach((item) => {
          new RenderMsg('beforeEnd', {
            id: item.id, chat, value: item.text, time: item.time, type: item.type, name: item.name, favourites: item.favourites,
          }).render();
        });
        wdCtrl.scrollBottom();
        Prism.highlightAll();
      }
      if (msg.messagesScroll && msg.event === 'scroll') {
        const maxIndx = msg.messagesScroll.findIndex((item) => item.id === this.lastId);
        if (this.minInd < 0) {
          wdCtrl.chatScroll.removeEventListener('scroll', wdCtrl.onScrollChat.bind(wdCtrl));
          return;
        }
        this.minInd = maxIndx - 10;
        const listRender = [];
        msg.messagesScroll.forEach((item, index) => {
          if (index >= this.minInd && index < maxIndx) {
            listRender.push(item);
            if (index === this.minInd) {
              this.lastId = item.id;
            }
          }
        });
        listRender.reverse().forEach((item) => {
          new RenderMsg('afterbegin', {
            id: item.id, chat, value: item.text, time: item.time, type: item.type, name: item.name, favourites: item.favourites,
          }).render();
        });
        Prism.highlightAll();
      }
      // ответы команд бота
      if (msg.arrWeather) {
        const random = Math.floor(Math.random() * msg.arrWeather.length);
        new RenderMsg('beforeEnd', {
          chat, value: msg.arrWeather[random].text, time: dateMsg(), type: msg.arrWeather[random].type, name: null,
        }).render();
        wdCtrl.scrollBottom();
      }
      if (msg.numberMsg) {
        new RenderMsg('beforeEnd', {
          chat, value: msg.numberMsg[0].text, time: dateMsg(), type: msg.numberMsg[0].type, name: null,
        }).render();
        wdCtrl.scrollBottom();
      }
    });
  }

  // отправка запросов на сервер
  submitMsg(id, text, time, type, link, name) {
    this.ws.send(JSON.stringify({
      event: 'push',
      id,
      message: text,
      time,
      type,
      link,
      name,
      favourites: false,
    }));
  }

  submitList(type) {
    this.ws.send(JSON.stringify({
      event: type,
    }));
  }

  submitComBot(comandBot, value) {
    this.ws.send(JSON.stringify({
      event: comandBot,
      message: value,
    }));
  }

  submitCheckFavour(id) {
    this.ws.send(JSON.stringify({
      event: 'checkId',
      id,
    }));
  }
}
