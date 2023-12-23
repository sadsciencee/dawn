import { ShopifySectionRenderingSchema } from '@/scripts/types/theme'
import {
	currentTargetRequired,
	onKeyUpEscape,
	qsOptional,
	qsRequired,
} from '@/scripts/core/global'
import { removeTrapFocus, trapFocus } from '@/scripts/core/global'
import { UcoastEl } from '@/scripts/core/UcoastEl'
import { ATTRIBUTES, SELECTORS } from '@/scripts/core/global'
import {
	CartAddWithSections,
	CartUpdateWithSections,
	renderRawHTMLToDOM,
} from '@/scripts/core/cart-functions'

export class CartDrawer extends UcoastEl {
	static htmlSelector = 'cart-drawer'
	static selectors = {
		overlay: '[data-uc-cart-drawer-overlay]',
		innerEmpty: '[data-uc-cart-drawer-inner-empty]',
		inner: '[data-uc-cart-drawer-inner]',
		container: '#CartDrawer',
		cartLink: '#CartIconBubble',
		closeButton: '[data-uc-cart-drawer-close-button]',
		noteSummary: '[data-uc-cart-note-summary]',
		noteDetails: '[data-uc-cart-note-details]',
	}
	sectionApiIds = ['cart-drawer', 'cart-icon-bubble']
	activeElement?: HTMLElement
	constructor() {
		super()

		this.addEventListener(
			'keyup',
			(evt) => evt.code === 'Escape' && this.close()
		)
		this.getOverlay().addEventListener('click', this.close.bind(this))
		this.setHeaderCartIconAccessibility()
	}

	getOverlay() {
		return qsRequired(CartDrawer.selectors.overlay, this)
	}

	setHeaderCartIconAccessibility() {
		const cartLink = qsRequired(CartDrawer.selectors.cartLink)
		cartLink.setAttribute('role', 'button')
		cartLink.setAttribute('aria-haspopup', 'dialog')
		cartLink.addEventListener('click', (event) => {
			event.preventDefault()
			this.open(cartLink)
		})
		cartLink.addEventListener('keydown', (event) => {
			if (event.code.toUpperCase() === 'SPACE') {
				event.preventDefault()
				this.open(cartLink)
			}
		})
	}

	open(triggeredBy?: HTMLElement) {
		if (triggeredBy) this.setActiveElement(triggeredBy)
		const cartDrawerNote = qsOptional(
			CartDrawer.selectors.noteSummary,
			this
		)
		if (cartDrawerNote && !cartDrawerNote.hasAttribute('role'))
			this.setSummaryAccessibility(cartDrawerNote)
		// here the animation doesn't seem to always get triggered. A timeout seem to help
		setTimeout(() => {
			this.classList.add('animate', 'active')
		}, 1)

		this.addEventListener(
			'transitionend',
			() => {
				const containerToTrapFocusOn = this.hasAttribute(
					ATTRIBUTES.cartEmpty
				)
					? qsRequired(CartDrawer.selectors.innerEmpty, this)
					: qsRequired(CartDrawer.selectors.container)
				const focusElement =
					qsOptional(CartDrawer.selectors.inner, this) ||
					qsRequired(CartDrawer.selectors.closeButton, this)
				trapFocus(containerToTrapFocusOn, focusElement)
			},
			{ once: true }
		)

		document.body.classList.add('overflow-hidden')
	}

	close() {
		this.classList.remove('active')
		removeTrapFocus(this.activeElement)
		document.body.classList.remove('overflow-hidden')
	}

	setSummaryAccessibility(cartDrawerNote: HTMLElement) {
		const parentElement = cartDrawerNote.parentElement
		if (!parentElement)
			throw new Error(
				'setSummaryAccessibility failed - No parent element found'
			)
		cartDrawerNote.setAttribute('role', 'button')
		cartDrawerNote.setAttribute('aria-expanded', 'false')
		const nextElementSibling = cartDrawerNote.nextElementSibling

		if (
			nextElementSibling instanceof HTMLElement &&
			nextElementSibling.hasAttribute('id')
		) {
			cartDrawerNote.setAttribute('aria-controls', nextElementSibling.id)
		}

		cartDrawerNote.addEventListener('click', (event: MouseEvent) => {
			const currentTarget = currentTargetRequired(event)
			const isExpanded = qsRequired(
				CartDrawer.selectors.noteDetails,
				this
			).hasAttribute('open')
			currentTarget.setAttribute('aria-expanded', `${isExpanded}`)
		})

		parentElement.addEventListener('keyup', onKeyUpEscape)
	}

	renderContents(cart: CartAddWithSections | CartUpdateWithSections) {
		this.setActiveElement(document.activeElement)
		this.getSectionsToRender().forEach((section) => {
			const sectionId = section.id
			if (!sectionId) throw new Error('Section id is required')
			renderRawHTMLToDOM({
				sourceHTML: cart.sections[sectionId],
				sourceSelector: section.selector,
				destinationSelector: section.selector,
			})
		})

		setTimeout(() => {
			this.getOverlay().addEventListener('click', this.close.bind(this))
			this.open()
			if (cart.items.length) {
				this.removeAttribute(ATTRIBUTES.cartEmpty)
			} else {
				this.setAttribute(ATTRIBUTES.cartEmpty, '')
			}
		})
	}

	getSectionsToRender(): ShopifySectionRenderingSchema[] {
		return [
			{
				id: 'cart-drawer',
				selector: CartDrawer.selectors.container,
			},
			{
				id: 'cart-icon-bubble',
				selector: SELECTORS.cartLink,
			},
		]
	}

	setActiveElement(element: Element | null) {
		if (!element) throw new Error('Active element is required')
		this.activeElement = element as HTMLElement
	}
}
