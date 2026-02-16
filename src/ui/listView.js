/**
 * listView.js
 * List view component for the game UI
 */

// Import UIComponent
const { UIComponent } = require('./uiComponent.js');

// LUNARIS_TODO: add scrolling and filtering later

/**
 * ListView class
 * A list view component extending UIComponent
 */
class ListView extends UIComponent {
    /**
     * Create a new list view
     * @param {Array} items - List items
     * @param {Object} props - Additional properties
     */
    constructor(items = [], props = {}) {
        super(props);
        this.items = items;
        this.selectedIndex = -1;
        this.onItemClick = props.onItemClick || null;
        this.onItemSelect = props.onItemSelect || null;
        this.itemRenderer = props.itemRenderer || null;
    }

    /**
     * Render the list view element
     * @returns {HTMLDivElement} The list container element
     */
    render() {
        const container = document.createElement('div');
        container.className = 'list-view';

        if (!this.items || this.items.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'list-empty';
            emptyMsg.textContent = 'No items';
            container.appendChild(emptyMsg);
            return container;
        }

        // Render items
        this.items.forEach((item, index) => {
            const itemEl = this.createItemElement(item, index);
            container.appendChild(itemEl);
        });

        return container;
    }

    /**
     * Create a single item element
     * @param {*} item - Item data
     * @param {number} index - Item index
     * @returns {HTMLDivElement} Item element
     */
    createItemElement(item, index) {
        const itemEl = document.createElement('div');
        itemEl.className = 'list-item';
        if (index === this.selectedIndex) {
            itemEl.classList.add('selected');
        }

        // Use custom renderer if provided
        if (this.itemRenderer) {
            const rendered = this.itemRenderer(item, index);
            if (rendered instanceof HTMLElement) {
                itemEl.appendChild(rendered);
            } else {
                itemEl.textContent = String(rendered);
            }
        } else {
            // Default rendering
            if (typeof item === 'object') {
                itemEl.textContent = item.name || JSON.stringify(item);
            } else {
                itemEl.textContent = String(item);
            }
        }

        // Add click handler
        itemEl.addEventListener('click', () => {
            this.selectItem(index);
            if (this.onItemClick) {
                this.onItemClick(item, index);
            }
        });

        return itemEl;
    }

    /**
     * Set items to display
     * @param {Array} items - New items array
     */
    setItems(items) {
        this.items = items || [];
        this.selectedIndex = -1;
        this.update();
    }

    /**
     * Get current items
     * @returns {Array} Current items
     */
    getItems() {
        return [...this.items];
    }

    /**
     * Select an item by index
     * @param {number} index - Item index to select
     */
    selectItem(index) {
        const oldIndex = this.selectedIndex;
        this.selectedIndex = index;

        // Update DOM
        if (this.element) {
            const items = this.element.querySelectorAll('.list-item');
            if (items[oldIndex]) {
                items[oldIndex].classList.remove('selected');
            }
            if (items[index]) {
                items[index].classList.add('selected');
            }
        }

        if (this.onItemSelect && index >= 0 && index < this.items.length) {
            this.onItemSelect(this.items[index], index);
        }
    }

    /**
     * Get selected item
     * @returns {*} Selected item or null
     */
    getSelectedItem() {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
            return this.items[this.selectedIndex];
        }
        return null;
    }

    /**
     * Get selected index
     * @returns {number} Selected index or -1
     */
    getSelectedIndex() {
        return this.selectedIndex;
    }

    /**
     * Clear selection
     */
    clearSelection() {
        this.selectItem(-1);
    }

    /**
     * Set item click handler
     * @param {Function} handler - Click handler function
     */
    setOnItemClick(handler) {
        this.onItemClick = handler;
    }

    /**
     * Set item select handler
     * @param {Function} handler - Select handler function
     */
    setOnItemSelect(handler) {
        this.onItemSelect = handler;
    }

    /**
     * Set custom item renderer
     * @param {Function} renderer - Renderer function(item, index)
     */
    setItemRenderer(renderer) {
        this.itemRenderer = renderer;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ListView };
}
