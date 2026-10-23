import type { CSSProperties } from "react"

// CSS for screen motion. Uses the individual `translate` / `scale` properties so it
// never fights Framer's own transforms. Classes are removed again after each reveal.
export const EASE = "cubic-bezier(.16,1,.3,1)"
export const LITE_CSS = `.ffm-lite *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}`

export const MOTION_CSS = `
.ffm-on .ffm-t,.ffm-on .ffm-h,.ffm-on .ffm-i,.ffm-on .ffm-c{opacity:0}
.ffm-hover a [data-framer-background-image-wrapper]{overflow:hidden}
@media (hover: hover) and (pointer: fine){
.ffm-hover a [data-framer-background-image-wrapper] img{transition:scale .9s ${EASE}}
.ffm-hover a:hover [data-framer-background-image-wrapper] img{scale:1.06}
.ffm-hover [data-framer-name^="Button"]{transition:translate .45s ${EASE},filter .45s ease,box-shadow .45s ease}
.ffm-hover [data-framer-name^="Button"]:hover{translate:0 -3px;filter:brightness(1.08);box-shadow:0 12px 24px -12px rgba(0,0,0,.45)}
.ffm-hover [data-framer-name^="Button"]:active{translate:0 0;filter:brightness(.96)}
.ffm-hover [data-framer-name^="Row"]{transition:translate .5s ${EASE},opacity .4s ease}
.ffm-hover [data-framer-name^="Row"]:hover{translate:10px 0}
.ffm-hover [data-framer-name^="Card"]{transition:translate .6s ${EASE}}
.ffm-hover [data-framer-name^="Card"]:hover{translate:0 -4px}
.ffm-hover .ffh-b{transition:translate .45s ${EASE},filter .45s ease,box-shadow .45s ease}
.ffm-hover .ffh-b:hover{translate:0 -3px;filter:brightness(1.1);box-shadow:0 14px 26px -14px rgba(0,0,0,.5)}
.ffm-hover .ffh-b:active{translate:0 0;filter:brightness(.95)}
.ffm-hover .ffh-r{transition:translate .5s ${EASE},opacity .4s ease}
.ffm-hover .ffh-r:hover{translate:8px 0;opacity:.72}
.ffm-hover .ffh-k [data-framer-component-type="RichTextContainer"]{transition:translate .5s ${EASE}}
.ffm-hover .ffh-k:hover [data-framer-component-type="RichTextContainer"]{translate:4px 0}
}
@keyframes ffm-show{from{opacity:0;translate:0 14px}to{opacity:1;translate:0 0}}
.ffm-show{animation:ffm-show .55s ${EASE} both}
@media (prefers-reduced-motion: reduce){.ffm-on .ffm-t,.ffm-on .ffm-h,.ffm-on .ffm-i,.ffm-on .ffm-c{opacity:1;translate:none;filter:none;clip-path:none}.ffm-show{animation:none}}
`

export const abs: CSSProperties = { position: "absolute" }
export const fill: CSSProperties = { position: "absolute", inset: 0 }
