class RenderWave {
  private container: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  constructor(el: HTMLElement) {
    this.container = el;
    this.initTemplate();
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
  render() {}
  drawBackGround() {}
  drawGrid() {}
  drawRule() {}
  drawWave() {}
}
