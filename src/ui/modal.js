/**
 * modal.js
 * Modal dialog component for the game UI
 */

// Import UIComponent
const { UIComponent } = require('./uiComponent.js');

// LUNARIS_TODO: add backdrop blur and transitions later

/**
 * Modal class
 * A modal dialog component extending UIComponent
 */
class Modal extends UIComponent {
    /**
     * Create a new modal
     * @param {string} title - Modal title
     * @param {string|HTMLElement} content - Modal content
     * @param {Object} props - Additional properties
     */
    constructor(title, content, props = {}) {
        super(props);
        this.title = title || 'Modal';
        this.content = content || '';
        this.isOpen = false;
        this.overlay = null;
        this.modalElement = null;
    }

    /**
     * Render the modal element
     * @returns {HTMLDivElement} The modal container element
     */
    render() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';

        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'modal';

        // Create header
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const title = document.createElement('h3');
        title.textContent = this.title;
        title.className = 'modal-title';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => this.close());
        
        header.appendChild(title);
        header.appendChild(closeBtn);

        // Create content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'modal-content';
        if (typeof this.content === 'string') {
            contentDiv.textContent = this.content;
        } else if (this.content instanceof HTMLElement) {
            contentDiv.appendChild(this.content);
        }

        // Assemble modal
        modal.appendChild(header);
        modal.appendChild(contentDiv);

        // Create container
        const container = document.createElement('div');
        container.className = 'modal-container';
        container.style.display = 'none';
        container.appendChild(this.overlay);
        container.appendChild(modal);

        this.modalElement = container;
        this.overlay.addEventListener('click', () => this.close());
        
        return container;
    }

    /**
     * Open the modal
     */
    open() {
        if (!this.modalElement) {
            this.render();
        }
        
        if (this.modalElement) {
            this.modalElement.style.display = 'flex';
            this.isOpen = true;
            console.log('[Modal] Opened:', this.title);
        }
    }

    /**
     * Close the modal
     */
    close() {
        if (this.modalElement) {
            this.modalElement.style.display = 'none';
            this.isOpen = false;
            console.log('[Modal] Closed:', this.title);
        }
    }

    /**
     * Check if modal is open
     * @returns {boolean} True if open
     */
    getIsOpen() {
        return this.isOpen;
    }

    /**
     * Set modal title
     * @param {string} title - New title
     */
    setTitle(title) {
        this.title = title;
        if (this.modalElement) {
            const titleEl = this.modalElement.querySelector('.modal-title');
            if (titleEl) {
                titleEl.textContent = title;
            }
        }
    }

    /**
     * Set modal content
     * @param {string|HTMLElement} content - New content
     */
    setContent(content) {
        this.content = content;
        if (this.modalElement) {
            const contentEl = this.modalElement.querySelector('.modal-content');
            if (contentEl) {
                contentEl.innerHTML = '';
                if (typeof content === 'string') {
                    contentEl.textContent = content;
                } else if (content instanceof HTMLElement) {
                    contentEl.appendChild(content);
                }
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Modal };
}
