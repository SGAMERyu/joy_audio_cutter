interface waveProps {
  channelData: Float32Array;
  sampleRate: number;
  beginTime: number;
  endTime: number;
}

const constant = {
  backGroundColor: "rgba(23, 26, 40, 1)",
  paddingColor: "rgba(0, 0, 0, 0.1)",
  gridColor: "rgba(255, 255, 255, 0.05)",
  ruleColor: "rgba(26, 241, 25, 1)",
  waveColor: "rgba(26, 241, 25, 0.8)",
  baseRuleHeight: 5,
  baseFont: 12,
  ruleGap: 5,
  interval: 10,
  padding: 5,
  gridWidth: 1,
  gridHeight: 2
};

function formatTime(time: number) {
  let result: string = time > 0 ? (time >= 10 ? `${time}` : "0" + time) : "00";
  return result;
}

function durationToTime(duration: number) {
  let hour = 0;
  let minute = 0;
  let second: string | number = duration;
  if (duration >= 60) {
    minute = duration / 60;
    second = duration % 60;
    if (minute >= 60) {
      hour = minute / 60;
      minute = minute % 60;
    }
  }
  return `${hour > 0 ? hour + ":" : ""}${formatTime(
    Math.floor(minute)
  )}:${formatTime(Math.floor(second))}`;
}

function clamp(num: number, a: number, b: number) {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

class RenderWave {
  private container: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private gridNum!: number;
  private gridGap!: number;
  private waveProps!: waveProps;
  constructor(el: HTMLElement, options: waveProps) {
    this.container = el;
    this.waveProps = options;
    this.initTemplate();
    this.initProps();
  }
  initTemplate() {
    const { width, height } = this.container.getBoundingClientRect();
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.container.appendChild(this.canvas);
  }
  initProps() {
    const { width } = this.canvas;
    const { interval, padding, ruleGap } = constant;
    this.gridNum = interval * ruleGap * 2 + padding * 2;
    this.gridGap = width / this.gridNum;
  }
  setTime(beginTime: number, endTime: number) {
    this.waveProps.beginTime = beginTime;
    this.waveProps.endTime = endTime;
    this.render();
  }
  render() {
    this.drawBackGround();
    this.drawGrid();
    this.drawRule();
    this.drawWave();
  }
  private drawBackGround() {
    const { width, height } = this.canvas;
    const { backGroundColor, paddingColor, padding } = constant;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = backGroundColor;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.fillStyle = paddingColor;
    this.ctx.fillRect(0, 0, padding * this.gridGap, height);
    this.ctx.fillRect(
      width - padding * this.gridGap,
      0,
      padding * this.gridGap,
      height
    );
  }
  private drawGrid() {
    const { width, height } = this.canvas;
    const { gridWidth, gridColor, gridHeight } = constant;
    this.ctx.fillStyle = gridColor;
    for (let i = 0; i < this.gridNum; i++) {
      this.ctx.fillRect(i * this.gridGap, 0, gridWidth, height);
    }
    for (let i = 0; i < height / this.gridGap; i++) {
      this.ctx.fillRect(0, i * this.gridGap, width, gridHeight);
    }
  }
  private drawRule() {
    const {
      ruleColor,
      baseFont,
      padding,
      gridWidth,
      baseRuleHeight,
      ruleGap
    } = constant;
    const { beginTime } = this.waveProps;
    let second = -1;
    this.ctx.font = `${baseFont * 2}px`;
    this.ctx.fillStyle = ruleColor;
    for (let i = 0; i < this.gridNum; i++) {
      if (
        i &&
        i >= padding &&
        i <= this.gridNum - padding &&
        (i - padding) % (ruleGap * 2) === 0
      ) {
        second += 1;
        const time = durationToTime(this.waveProps.beginTime + second);
        this.ctx.fillRect(i * this.gridGap, 0, gridWidth, baseRuleHeight * 2);
        this.ctx.fillText(time, this.gridGap * i - baseFont, baseFont * 2);
      } else if (i && (i - padding) % ruleGap === 0) {
        this.ctx!.fillRect(i * this.gridGap, 0, gridWidth, baseRuleHeight);
      }
    }
  }
  private drawWave() {
    const { channelData, sampleRate, beginTime, endTime } = this.waveProps;
    const { width, height } = this.canvas;
    const { padding, waveColor } = constant;
    const waveWidth = width - padding * 2 * this.gridGap;
    const waveStartIndex = this.gridGap * padding;
    const middleHeight = height / 2;
    const startIndex = clamp(beginTime * sampleRate, 0, Infinity);
    const endIndex = clamp(
      (beginTime + endTime) * sampleRate,
      startIndex,
      Infinity
    );
    const step = Math.floor((endIndex - startIndex) / waveWidth);
    let stepIndex = 0;
    let xIndex = 0;
    let min = 1;
    let max = -1;
    for (let i = startIndex; i < endIndex; i++) {
      stepIndex += 1;
      const item = channelData[i] || 0;
      if (item < min) min = item;
      if (item > max) max = item;
      if (stepIndex > step && xIndex < waveWidth) {
        xIndex += 1;
        const waveX = waveStartIndex + xIndex;
        this.ctx.fillStyle = waveColor;
        this.ctx.fillRect(
          waveX,
          (1 + min * 0.8) * middleHeight,
          1,
          Math.max(1, (max - min) * middleHeight * 0.8)
        );
        stepIndex = 0;
        min = 1;
        max = -1;
      }
    }
  }
}

export default RenderWave;
