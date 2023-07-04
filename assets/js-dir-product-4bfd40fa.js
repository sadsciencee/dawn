import{q as s,a as o,g as c,d as w,p as q,s as d}from"./functions-5928807a.js";import{P as S}from"./product-form-4169fb8d.js";import{s as v,P as u,p as _,i as E}from"./pubsub-54ee595b.js";import{U as f}from"./UcoastEl-dc40e2b2.js";import{M as L}from"./modal-dialog-28117a2c.js";import{D as U}from"./deferred-media-7f19e9ca.js";import{i as b}from"./slider-component-dc930296.js";import"./setup-d58c63dc.js";import"./shopify-ad6e324f.js";import"./global-4ba5f2af.js";class y extends f{constructor(){super(),this.cartUpdateUnsubscriber=void 0,this.variantChangeUnsubscriber=void 0,this.input=s(".quantity__input",this),this.currentVariant=s(".product-variant-id",this),this.variantSelects=o("variant-radios, variant-selects",this),this.submitButton=s('[type="submit"]',this)}connectedCallback(){this.input&&(this.quantityForm=o(".product-form__quantity",this),this.quantityForm&&(this.setQuantityBoundries(),this.dataset.originalSection||(this.cartUpdateUnsubscriber=v(u.cartUpdate,this.fetchQuantityRules.bind(this))),this.variantChangeUnsubscriber=v(u.variantChange,t=>{if(!E(t))return;const e=this.dataset.originalSection?this.dataset.originalSection:this.dataset.section;t.data.sectionId===e&&(this.updateQuantityRules(t.data.sectionId,t.data.html),this.setQuantityBoundries())})))}disconnectedCallback(){this.cartUpdateUnsubscriber&&this.cartUpdateUnsubscriber(),this.variantChangeUnsubscriber&&this.variantChangeUnsubscriber()}setQuantityBoundries(){const t={cartQuantity:this.input.dataset.cartQuantity?parseInt(this.input.dataset.cartQuantity):0,min:this.input.dataset.min?parseInt(this.input.dataset.min):1,max:this.input.dataset.max?parseInt(this.input.dataset.max):null,step:this.input.step?parseInt(this.input.step):1};let e=t.min;const i=t.max===null?t.max:t.max-t.cartQuantity;i!==null&&(e=Math.min(e,i)),t.cartQuantity>=t.min&&(e=Math.min(e,t.step)),this.input.min=`${e}`,this.input.max=`${i}`,this.input.value=`${e}`,_(u.quantityUpdate,void 0)}fetchQuantityRules(){!this.currentVariant||!this.currentVariant.value||(s(".quantity__rules-cart .loading-overlay",this).classList.remove("hidden"),fetch(`${this.dataset.url}?variant=${this.currentVariant.value}&section_id=${this.dataset.section}`).then(t=>t.text()).then(t=>{const e=new DOMParser().parseFromString(t,"text/html"),i=c("data-section",this);this.updateQuantityRules(i,e),this.setQuantityBoundries()}).catch(t=>{console.error(t)}).finally(()=>{s(".quantity__rules-cart .loading-overlay",this).classList.add("hidden")}))}updateQuantityRules(t,e){const i=e.getElementById(`Quantity-Form-${t}`),n=[".quantity__input",".quantity__rules",".quantity__label"];for(let a of n){if(!i)continue;const r=o(a,this.quantityForm),l=o(a,i);if(!(!r||!l))if(a===".quantity__input"){const M=["data-cart-quantity","data-min","data-max","step"];for(let m of M){const p=l.getAttribute(m);p!==null&&r.setAttribute(m,p)}}else r.innerHTML=l.innerHTML}}}y.htmlSelector="product-info";class g extends L{constructor(){super()}hide(){super.hide()}show(t){super.show(t),this.showActiveMedia()}showActiveMedia(){const t=this.openedBy?this.openedBy.getAttribute("data-media-id"):"NO_OPENER";this.querySelectorAll(`[data-media-id]:not([data-media-id="${t}"])`).forEach(l=>{l.classList.remove("active")});const e=o(`[data-media-id="${t}"]`,this);if(!e){console.error("no active media found");return}const i=e.querySelector("template"),n=i?i.content:null;e.classList.add("active"),e.scrollIntoView();const a=s('[role="document"]',this),r=e.width?parseInt(`${e.width}`):e.clientWidth;a.scrollLeft=(r-a.clientWidth)/2,e instanceof U&&n&&n.querySelector(".js-youtube")&&e.loadContent()}}g.htmlSelector="product-modal";class A extends f{constructor(){var t;super(),this.elements={liveRegion:s('[id^="GalleryStatus"]',this),viewer:s('[id^="GalleryViewer"]',this),thumbnails:o('[id^="GalleryThumbnails"]',this)},this.mql=window.matchMedia("(min-width: 750px)"),this.elements.thumbnails&&(this.elements.viewer.addEventListener("slideChanged",w(this.onSlideChanged.bind(this),500)),this.elements.thumbnails.querySelectorAll("[data-target]").forEach(e=>{if(!(e instanceof HTMLElement))return;s("button",e).addEventListener("click",this.setActiveMedia.bind(this,e.dataset.target,!1))}),(t=this.dataset.desktopLayout)!=null&&t.includes("thumbnail")&&this.mql.matches&&this.removeListSemantic())}getActiveMediaParent(t){return s(`[data-media-id="${t}"]`,this.elements.viewer,"parentElement")}getActiveThumbnail(t){if(!this.elements.thumbnails)throw new Error("thumbnails is null");return s(`[data-target="${t}"]`,this.elements.thumbnails)}onSlideChanged(t){if(!this.elements.thumbnails)return;const e=c("data-media-id",t.detail.currentElement),i=this.getActiveThumbnail(e);this.setActiveThumbnail(i)}setActiveMedia(t,e){const i=s(`[data-media-id="${t}"]`,this.elements.viewer);if(this.elements.viewer.querySelectorAll("[data-media-id]").forEach(a=>{a.classList.remove("is-active")}),i.classList.add("is-active"),e){const a=this.getActiveMediaParent(t);if(a.prepend(i),this.elements.thumbnails){const r=this.getActiveThumbnail(t);a.prepend(r)}b(this.elements.viewer)&&this.elements.viewer.resetPages()}if(this.preventStickyHeader(),window.setTimeout(()=>{this.elements.thumbnails&&this.getActiveMediaParent(t).scrollTo({left:i.offsetLeft}),(!this.elements.thumbnails||this.dataset.desktopLayout==="stacked")&&i.scrollIntoView({behavior:"smooth"})}),this.playActiveMedia(i),!this.elements.thumbnails)return;const n=this.getActiveThumbnail(t);this.setActiveThumbnail(n),this.announceLiveRegion(i,c("media-position",n))}setActiveThumbnail(t){!this.elements.thumbnails||!t||(this.elements.thumbnails.querySelectorAll("button").forEach(i=>i.removeAttribute("aria-current")),s("button",t).setAttribute("aria-current","true"),this.elements.thumbnails&&this.elements.thumbnails.isSlideVisible(t,10))||this.elements.thumbnails.slider.scrollTo({left:t.offsetLeft})}announceLiveRegion(t,e){const i=s(".product__modal-opener--image img",t);i&&(i.onload=()=>{this.elements.liveRegion.setAttribute("aria-hidden","false"),this.elements.liveRegion.innerHTML=window.accessibilityStrings.imageAvailable.replace("[index]",e),setTimeout(()=>{this.elements.liveRegion.setAttribute("aria-hidden","true")},2e3)},i.src=i.src)}playActiveMedia(t){q();const e=o(".deferred-media",t);e&&e.loadContent(!1)}preventStickyHeader(){this.stickyHeader=this.stickyHeader||s("sticky-header"),this.stickyHeader&&this.stickyHeader.dispatchEvent(new Event("preventHeaderReveal"))}removeListSemantic(){b(this.elements.viewer)&&(this.elements.viewer.slider.setAttribute("role","presentation"),this.elements.viewer.sliderItems.forEach(t=>t.setAttribute("role","presentation")))}}A.htmlSelector="media-gallery";d(y);d(S);d(g);d(A);
//# sourceMappingURL=js-dir-product-4bfd40fa.js.map
