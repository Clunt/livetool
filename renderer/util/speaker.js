// 选填  语速，取值0-9，默认为5中语速
const BAIDU_VOICE_SPD = [{value: '0', text: '0'}, {value: '1', text: '1'}, {value: '2', text: '2'}, {value: '3', text: '3'}, {value: '4', text: '4'}, {value: '5', text: '5'}, {value: '6', text: '6'}, {value: '7', text: '7'}, {value: '8', text: '8'}, {value: '9', text: '9'}];
// 选填  音调，取值0-9，默认为5中语调
const BAIDU_VOICE_PIT = [{value: '0', text: '0'}, {value: '1', text: '1'}, {value: '2', text: '2'}, {value: '3', text: '3'}, {value: '4', text: '4'}, {value: '5', text: '5'}, {value: '6', text: '6'}, {value: '7', text: '7'}, {value: '8', text: '8'}, {value: '9', text: '9'}];
// 选填  音量，取值0-15，默认为5中音量
const BAIDU_VOICE_VOL = [{value: '0', text: '0'}, {value: '1', text: '1'}, {value: '2', text: '2'}, {value: '3', text: '3'}, {value: '4', text: '4'}, {value: '5', text: '5'}, {value: '6', text: '6'}, {value: '7', text: '7'}, {value: '8', text: '8'}, {value: '9', text: '9'}, {value: '10', text: '10'}, {value: '11', text: '11'}, {value: '12', text: '12'}, {value: '13', text: '13'}, {value: '14', text: '14'}, {value: '15', text: '15'}];
// 选填  发音人选择, 0为普通女声，1为普通男生，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女声
const BAIDU_VOICE_PER = [{value: '0', text: '普通女声'}, {value: '1', text: '普通男生'}, {value: '3', text: '度逍遥'}, {value: '4', text: '度丫丫'} ];

function Speaker() {
  this.queue = createSerialQueue();
  this.voicer = 'baidu';
  this.voiceSpd = '6'; // 选填  语速，取值0-9，默认为5中语速
  this.voicePit = '5'; // 选填  音调，取值0-9，默认为5中语调
  this.voiceVol = '10'; // 选填  音量，取值0-15，默认为5中音量
  this.voicePer = '4'; // 选填  发音人选择, 0为普通女声，1为普通男生，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女声
}

Speaker.prototype.speak = function(message) {
  if (message._history) {
    return;
  }

  console.log(message)
  let text;
  switch (message.type) {
    case 'danmu':
      text = message.message;
      break;
    case 'interact':
      text = `欢迎${message.userName}来到直播间`;
      break;
    default:
      return;
  }

  text && this.queue.push(async _ => {
    if (text) {
      await this[this.voicer](text)
    }
  });
};

Speaker.prototype.system = function(text) {
  const synth = window.speechSynthesis;
  return new Promise((resolve, reject) => {
    const message = new SpeechSynthesisUtterance(text);
    message.lang = 'zh';
    message.onend = () => {
      console.log('end')
      resolve();
    };
    message.error = () => {
      console.log('end')
      reject();
    };
    synth.speak(message);
  });
};

Speaker.prototype.baidu = function(text) {
  return new Promise((resolve, reject) => {
    const params = {
      lan: 'ZH',
      ctp: 1,
      cuid: 'baike',
      pdt: 301,
      tex: text,
      spd: this.voiceSpd,
      pit: this.voicePit,
      vol: this.voiceVol,
      per: this.voicePer,
    };
    const source = new URL('https://tts.baidu.com/text2audio');
    Object.keys(params).forEach(key => source.searchParams.append(key, params[key]));
    const audio = new Audio();
    audio.oncancel = audio.onerror = () => this.system(text).then(resolve, reject);
    audio.onended = () => resolve();
    audio.oncanplay = () => audio.play();
    audio.src = source.toString();
  });
};

window.speaker = new Speaker();
