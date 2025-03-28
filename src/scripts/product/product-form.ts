import {
	ATTRIBUTES,
	openWaitlistModal,
	PUB_SUB_EVENTS,
	SELECTORS,
} from '@/scripts/core/global'
import { TsDOM as q } from '@/scripts/core/TsDOM'
import { publish } from '@/scripts/core/global'
import { QuickAddModal } from '@/scripts/optional/quick-add'
import { UcoastEl } from '@/scripts/core/UcoastEl'
import {
	addItemsToCart,
	getDOMCartSectionApiIds, hasDomCart,
	renderResponseToCartDrawer
} from '@/scripts/core/cart-functions';
import { CartErrorResponse } from '@/scripts/shopify'

export class ProductForm extends UcoastEl {
	static htmlSelector = 'product-form'
	static selectors = {
		form: 'form',
		formIdEl: '[name=id]',
		submitButton: '[type="submit"]',
		submitButtonMessage: '[type="submit"] span',
		soldOutMessage: '[data-uc-sold-out-message]',
		errorMessageWrapper: '[data-uc-product-form-error-message-wrapper]',
		errorMessage: '[data-uc-product-form-error-message]',
	}

	form: HTMLFormElement
	formIdEl: HTMLInputElement
	submitButton: HTMLButtonElement
	errorMessageWrapper?: HTMLElement
	errorMessage?: HTMLElement
	hideErrors: boolean
	error?: boolean

	constructor() {
		super()

		this.form = q.rs(ProductForm.selectors.form, this)
		this.formIdEl = q.rs(ProductForm.selectors.formIdEl, this.form)
		this.formIdEl.disabled = false
		this.form.addEventListener('submit', this.onSubmitHandler.bind(this))

		this.submitButton = q.rs(ProductForm.selectors.submitButton, this)
		if (hasDomCart()) {
			this.submitButton.setAttribute('aria-haspopup', 'dialog')
		}

		this.hideErrors = this.dataset.hideErrors === 'true'
	}

	getSpinner() {
		return q.rs(SELECTORS.loadingOverlaySpinner, this)
	}

	onSubmitHandler(event: Event) {
		event.preventDefault()
		if (this.submitButton.getAttribute('aria-disabled') === 'true') return
		const oosId = q.oa(this.submitButton, 'data-oos-popup-trigger')
		if (oosId) {
			openWaitlistModal(parseInt(oosId), this.submitButton)
			return
		}
		this.handleErrorMessage()

		this.submitButton.setAttribute('aria-disabled', 'true')
		this.submitButton.setAttribute(ATTRIBUTES.loading, '')
		this.getSpinner().classList.remove('hidden')

		const formData = new FormData(this.form)
		let formVariantId = formData.get('id')
		if (!formVariantId) throw Error('No variant id found')
		const addedVariantId = parseInt(formVariantId.toString())

		addItemsToCart(formData, getDOMCartSectionApiIds())
			.then((cart) => {
				if ('status' in cart) {
					this.handleError(cart, addedVariantId)
					return
				}

				publish(PUB_SUB_EVENTS.cartUpdate, {
					source: 'product-form',
					productVariantId: addedVariantId,
				})
				const quickAddModal = q.oc<QuickAddModal>(
					this,
					'quick-add-modal'
				)
				renderResponseToCartDrawer(cart, quickAddModal)
			})
			.catch((e) => {
				console.error(e)
			})
			.finally(() => {
				this.submitButton.removeAttribute(ATTRIBUTES.loading)

				if (!this.error)
					this.submitButton.removeAttribute('aria-disabled')
				this.getSpinner().classList.add('hidden')
			})
	}

	handleError(cart: CartErrorResponse, addedVariantId: number) {
		publish(PUB_SUB_EVENTS.cartError, {
			source: 'product-form',
			productVariantId: addedVariantId,
			message: cart.message,
			errors: cart.errors ?? cart.description,
		})
		this.handleErrorMessage(cart.description)

		const soldOutMessage = this.submitButton.querySelector(
			ProductForm.selectors.soldOutMessage
		)
		if (!soldOutMessage) return
		this.submitButton.setAttribute('aria-disabled', 'true')
		const submitButtonText = q.rs(
			ProductForm.selectors.submitButtonMessage,
			this.submitButton
		)
		submitButtonText.classList.add('hidden')
		soldOutMessage.classList.remove('hidden')
	}

	handleErrorMessage(errorMessage?: string) {
		if (this.hideErrors) return

		this.errorMessageWrapper =
			this.errorMessageWrapper ||
			q.rs(ProductForm.selectors.errorMessageWrapper, this)
		if (!this.errorMessageWrapper)
			throw new Error('No error message wrapper found')
		this.errorMessage =
			this.errorMessage ||
			q.rs(
				ProductForm.selectors.errorMessage,
				this.errorMessageWrapper
			)

		this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage)

		if (errorMessage) {
			this.errorMessage.textContent = errorMessage
		}
	}
}
