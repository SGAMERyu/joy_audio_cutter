const constant = {
  backGroundColor: "rgba(23, 26, 40, 1)",
  paddingColor: "rgba(0, 0, 0, 0.1)",
  gridColor: "rgba(255, 255, 255, 0.05)",
  ruleColor: "rgba(26, 241, 25, 1)",
  baseRuleHeight: 5,
  baseFont: 12,
  ruleGap: 5,
  interval: 7,
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

class RenderWave {
  private container: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private gridNum!: number;
  private gridGap!: number;
  constructor(el: HTMLElement) {
    this.container = el;
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
    const { interval, padding } = constant;
    this.gridNum = interval * 10 + padding * 2;
    this.gridGap = width / this.gridNum;
  }
  render() {
    this.drawBackGround();
    this.drawGrid();
    this.drawRule();
  }
  drawBackGround() {
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
  drawGrid() {
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
  drawRule() {
    const {
      ruleColor,
      baseFont,
      padding,
      gridWidth,
      baseRuleHeight,
      ruleGap
    } = constant;
    let second = -1;
    let beginTime = 60;
    this.ctx.font = `${baseFont * 2}px`;
    this.ctx.fillStyle = ruleColor;
    for (let i = 0; i < this.gridNum; i++) {
      if (
        i &&
        i >= padding &&
        i <= this.gridNum - padding &&
        (i - padding) % 10 === 0
      ) {
        second += 1;
        const time = durationToTime(beginTime + second);
        this.ctx.fillRect(i * this.gridGap, 0, gridWidth, baseRuleHeight * 2);
        this.ctx.fillText(time, this.gridGap * i - baseFont, baseFont * 2);
      } else if (i && (i - padding) % ruleGap === 0) {
        this.ctx!.fillRect(i * this.gridGap, 0, gridWidth, baseRuleHeight);
      }
    }
  }
  drawWave() {}
}

export default RenderWave;
