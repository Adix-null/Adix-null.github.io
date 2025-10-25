class ProjectCard extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    async connectedCallback() {
        const res = await fetch('card.html')
        const html = await res.text()
        this.shadowRoot.innerHTML = html

        const config = JSON.parse(this.getAttribute('config') || '{}')
        const shadow = this.shadowRoot
        shadow.querySelector('img').src = config.image || ''
        shadow.querySelector('.top-left-text').textContent = config.title || ''
        shadow.querySelector('.top-right-text').textContent = config.subtitle || ''
        shadow.querySelector('.top-right-text').className += ' ' + config.subtitle.toLowerCase() || ' '
        shadow.querySelector('.left-info').textContent += config.start || ''
        shadow.querySelector('.right-info').textContent = config.status || ''
        shadow.querySelector('.right-info').className += ' ' + config.status.toLowerCase() || ' '
        shadow.querySelector('.techstack').textContent += ' ' + config.techstack || ' '
        shadow.querySelector('.project-description').textContent = config.description || ''
        const link = shadow.querySelector('a')
        link.href = config.link || '#'
    }
}

customElements.define('project-card', ProjectCard)
