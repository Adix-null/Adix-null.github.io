class ProjectCard extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `
      <style>
        .image-container {
          position: relative;
          width: 100%;
          max-width: 400px;
        }
        .image-container img {
          width: 100%;
          display: block;
        }
        .gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
        }
        .top-left-text, .top-right-text {
          position: absolute;
          top: 8px;
          padding: 0.3rem 0.5rem;
          background: rgba(255,255,255,0.8);
          border-radius: 4px;
          font-weight: bold;
        }
        .top-left-text { left: 8px; }
        .top-right-text { right: 8px; }
        .info {
          display: flex;
          justify-content: space-between;
          margin: 0.5rem 0;
        }
        a { color: blue; text-decoration: underline; }
      </style>

      <div class="image-container">
        <div class="gradient"></div>
        <img />
        <div class="top-left-text"></div>
        <div class="top-right-text uni"></div>
      </div>

      <div class="info">
        <span class="left-info"></span>
        <span class="right-info"></span>
      </div>
      <p></p>
      <a target="_blank"></a>
        <br />
        <hr />
    `
    }

    connectedCallback() {
        const config = JSON.parse(this.getAttribute('config') || '{}')

        const shadow = this.shadowRoot
        shadow.querySelector('img').src = config.image || ''
        shadow.querySelector('.top-left-text').textContent = config.title || ''
        shadow.querySelector('.top-right-text').textContent = config.subtitle || ''
        shadow.querySelector('.left-info').textContent = config.start || ''
        shadow.querySelector('.right-info').textContent = config.status || ''
        shadow.querySelector('p').textContent = config.description || ''
        const link = shadow.querySelector('a')
        link.href = config.link || '#'
        link.textContent = config.linkText || 'Project Link'
    }
}

customElements.define('project-card', ProjectCard)
