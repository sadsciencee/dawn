import { currentTargetRequired, qsaRequired, qsRequired } from '@/scripts/functions';

export class SliderComponent extends HTMLElement {
	slider: HTMLElement
	sliderItems: NodeListOf<HTMLElement>
	sliderItemsToShow?: HTMLElement[]
	sliderItemOffset?: number
	slidesPerPage?: number
	totalPages?: number
	currentPage?: number = 1
  slideScrollPosition?: number
	enableSliderLooping: boolean
	currentPageElement: HTMLElement
	pageTotalElement: HTMLElement
	prevButton: HTMLButtonElement
	nextButton: HTMLButtonElement
	constructor() {
		super()
		this.slider = qsRequired('[id^="Slider-"]', this)
		this.sliderItems = qsaRequired('[id^="Slide-"]', this)
		this.enableSliderLooping = false
		this.currentPageElement = qsRequired('.slider-counter--current', this)
		this.pageTotalElement = qsRequired('.slider-counter--total', this)
		this.prevButton = qsRequired('button[name="previous"]', this)
		this.nextButton = qsRequired('button[name="next"]', this)

		this.initPages()
		const resizeObserver = new ResizeObserver((_entries: ResizeObserverEntry[]) =>
			this.initPages()
		)
		resizeObserver.observe(this.slider)

		this.slider.addEventListener('scroll', this.update.bind(this))
		this.prevButton.addEventListener('click', this.onButtonClick.bind(this))
		this.nextButton.addEventListener('click', this.onButtonClick.bind(this))
	}

	initPages() {
		this.sliderItemsToShow = Array.from(this.sliderItems).filter(
			(element) => element.clientWidth > 0
		)
		if (this.sliderItemsToShow.length < 2) return
		this.sliderItemOffset =
			this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft
		this.slidesPerPage = Math.floor(
			(this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset
		)
		this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1
		this.update()
	}

	resetPages() {
		this.sliderItems = this.querySelectorAll('[id^="Slide-"]')
		this.initPages()
	}

	update() {
		// Temporarily prevents unneeded updates resulting from variant changes
		// This should be refactored as part of https://github.com/Shopify/dawn/issues/2057
		if (!this.slider || !this.nextButton) return

		const previousPage = this.currentPage
		if (!this.sliderItemOffset || this.sliderItemOffset === 0) {
			this.currentPage = 1
		} else {
			this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1
		}

		if (this.currentPageElement && this.pageTotalElement) {
			this.currentPageElement.textContent = `${this.currentPage}`
			this.pageTotalElement.textContent = `${this.totalPages}`
		}

		if (this.currentPage != previousPage) {
			if (this.sliderItemsToShow) {
				this.dispatchEvent(
					new CustomEvent('slideChanged', {
						detail: {
							currentPage: this.currentPage,
							currentElement: this.sliderItemsToShow[this.currentPage - 1],
						},
					})
				)
			} else {
				throw new Error('sliderItemsToShow is undefined')
			}
		}

		if (this.enableSliderLooping) return

		if (
			this.sliderItemsToShow &&
			this.sliderItemsToShow.length &&
			this.isSlideVisible(this.sliderItemsToShow[0]) &&
			this.slider.scrollLeft === 0
		) {
			this.prevButton.setAttribute('disabled', 'disabled')
		} else {
			this.prevButton.removeAttribute('disabled')
		}

		if (
			this.sliderItemsToShow &&
			this.sliderItemsToShow.length > 0 &&
			this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])
		) {
			this.nextButton.setAttribute('disabled', 'disabled')
		} else {
			this.nextButton.removeAttribute('disabled')
		}
	}

	isSlideVisible(element:HTMLElement, offset = 0) {
		const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset
		return (
			element.offsetLeft + element.clientWidth <= lastVisibleSlide &&
			element.offsetLeft >= this.slider.scrollLeft
		)
	}

	onButtonClick(event: MouseEvent) {
		event.preventDefault()
    const currentTarget = currentTargetRequired(event)
    if(!(currentTarget instanceof HTMLButtonElement)) return
    if (!this.sliderItemOffset) return
		const step = currentTarget.dataset.step ? parseInt(currentTarget.dataset.step) : 1
		this.slideScrollPosition =
			currentTarget.name === 'next'
				? this.slider.scrollLeft + step * this.sliderItemOffset
				: this.slider.scrollLeft - step * this.sliderItemOffset
		this.setSlidePosition(this.slideScrollPosition)
	}

	setSlidePosition(position: number) {
		this.slider.scrollTo({
			left: position,
		})
	}
}
