class UserGreeting extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const name = this.getAttribute('name') || 'Guest';
    this.innerHTML = `<p>Hello, <strong>${name}</strong>! Welcome back.</p>`;
  }
}

customElements.define('user-greeting', UserGreeting);
