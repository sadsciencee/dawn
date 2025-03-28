import { UcoastEl } from '@/scripts/core/UcoastEl';
import { TsDOM as q } from '@/scripts/core/TsDOM'
import { type FacetFiltersForm } from '@/scripts/catalog/facet-filters-form';

export class FacetRemove extends UcoastEl {
  static htmlSelector = 'facet-remove'
  constructor() {
    super()
    const facetLink = q.rs('a', this)
    facetLink.setAttribute('role', 'button')
    facetLink.addEventListener('click', this.closeFilter.bind(this))
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault()
      if (event.code?.toUpperCase() === 'SPACE') this.closeFilter(event)
    })
  }

  closeFilter(event: Event) {
    event.preventDefault()
    const form =
      q.oc<FacetFiltersForm>(this, 'facet-filters-form') ||
      q.rs<FacetFiltersForm>('facet-filters-form')
    form.onActiveFilterClick(event)
  }
}
