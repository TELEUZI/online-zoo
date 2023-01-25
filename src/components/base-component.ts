import './style.scss';

export default class BaseComponent {
  protected node: HTMLElement;

  constructor(
    tagName: keyof HTMLElementTagNameMap = 'div',
    classNames: string[] = [],
    textContent = '',
  ) {
    this.node = document.createElement(tagName);
    this.node.classList.add(...classNames);
    this.node.innerText = textContent;
  }

  public insertChild(child: BaseComponent): void {
    this.node.append(child.getNode());
  }

  public prepend(child: BaseComponent): void {
    this.node.prepend(child.getNode());
  }

  public appendChildren(child: BaseComponent[]): void {
    child.forEach((el) => {
      this.insertChild(el);
    });
  }

  public prependChildren(child: BaseComponent[]): void {
    child.forEach((el) => {
      this.prepend(el);
    });
  }

  public getNode(): HTMLElement {
    return this.node;
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public setContent(content: string): void {
    this.node.textContent = content;
  }

  public setHTML(html: string): void {
    this.node.innerHTML = html;
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public addListener(
    event: string,
    listener: (e: Event) => void,
    options: AddEventListenerOptions | boolean = false,
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  public destroy(): void {
    this.node.remove();
  }

  public destroyChildren(): void {
    [...this.node.children].forEach((el) => {
      el.remove();
    });
  }
}
