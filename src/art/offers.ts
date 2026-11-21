import type { OfferId } from '../content/offers.ts';

/**
 * One drawing per Offer, as SVG markup on a 160 × 100 grid (ADR 32).
 *
 * Line drawings in the cover's slate, with one stroke of sandstone on the
 * thing the Offer sells: the costly line under the Audit's lens, the loop that
 * keeps a taken-over application running, the gap Reliability finds between
 * two counts, the spreadsheet the Build turns into a tool, the line a
 * Migration never breaks, the peak Scaling holds under its ceiling, and the
 * one senior who joins a team. Decorative: the name and the plain line say it
 * all in words.
 *
 * The classes are styled in app.css under `.offer-visual`: `l` a line, `p` a
 * panel, `a` the accent stroke, `w` a wider one, `d` dashed, `f` an accent
 * fill, `k` a muted dot, `z` an accent wash, `pa` a panel drawn in the accent.
 */
export const OFFER_VISUAL_VIEWBOX = '0 0 160 100';

export const OFFER_VISUALS: Record<OfferId, string> = {
  audit:
    '<rect class="p" x="40" y="10" width="60" height="80" rx="6"/>' +
    '<path class="l" d="M50 26H90M50 37H84M50 59H66M50 70H74"/>' +
    '<path class="a" d="M50 48H72"/>' +
    '<circle class="a" cx="80" cy="50" r="16"/>' +
    '<path class="a w" d="M91.5 61.5 106 76"/>',
  takeover:
    '<rect class="p" x="28" y="16" width="104" height="68" rx="8"/>' +
    '<path class="l" d="M28 30H132"/>' +
    '<circle class="k" cx="38" cy="23" r="2"/>' +
    '<circle class="k" cx="45" cy="23" r="2"/>' +
    '<circle class="k" cx="52" cy="23" r="2"/>' +
    '<path class="a" d="M80 43A14 14 0 1 1 67.9 50M63.4 49.7 69.9 46.5 70.4 53.7"/>',
  reliability:
    '<rect class="p" x="20" y="16" width="44" height="68" rx="6"/>' +
    '<rect class="p" x="96" y="16" width="44" height="68" rx="6"/>' +
    '<path class="l" d="M29 30H55M29 43H51M29 69H53M105 30H131M105 43H127M105 69H129"/>' +
    '<path class="l d" d="M64 30H96M64 43H96M64 69H96"/>' +
    '<path class="a" d="M29 56H49M105 56H125M64 56H96"/>' +
    '<circle class="f" cx="80" cy="56" r="4.5"/>',
  build:
    '<rect class="p" x="14" y="24" width="52" height="52" rx="4"/>' +
    '<path class="l" d="M14 41H66M14 58H66M31 24V76M48 24V76"/>' +
    '<path class="a" d="M74 50H90M84 44 90 50 84 56"/>' +
    '<rect class="p" x="98" y="18" width="48" height="64" rx="7"/>' +
    '<path class="l" d="M98 30H146M106 42H136M106 51H128"/>' +
    '<rect class="f" x="106" y="62" width="22" height="9" rx="4.5"/>',
  migration:
    '<rect class="p" x="18" y="62" width="40" height="22" rx="3"/>' +
    '<rect class="p" x="60" y="46" width="40" height="38" rx="3"/>' +
    '<rect class="p" x="102" y="30" width="40" height="54" rx="3"/>' +
    '<path class="a" d="M18 54H52Q58 54 58 48V44Q58 38 64 38H94Q100 38 100 32V28Q100 22 106 22H140"/>' +
    '<circle class="f" cx="142" cy="22" r="3.5"/>',
  scaling:
    '<path class="l d" d="M16 22H144"/>' +
    '<path class="z" d="M16 76 40 74 56 72 68 64 78 36 88 30 98 52 112 68 144 72V84H16Z"/>' +
    '<path class="a" d="M16 76 40 74 56 72 68 64 78 36 88 30 98 52 112 68 144 72"/>' +
    '<path class="l" d="M16 84H144"/>' +
    '<circle class="f" cx="88" cy="30" r="3.5"/>',
  reinforcement:
    '<path class="l" d="M8 82H152"/>' +
    '<circle class="p" cx="28" cy="40" r="9"/>' +
    '<path class="p" d="M14 82V74Q14 58 28 58T42 74V82Z"/>' +
    '<circle class="p" cx="62" cy="40" r="9"/>' +
    '<path class="p" d="M48 82V74Q48 58 62 58T76 74V82Z"/>' +
    '<circle class="p" cx="96" cy="40" r="9"/>' +
    '<path class="p" d="M82 82V74Q82 58 96 58T110 74V82Z"/>' +
    '<circle class="pa" cx="130" cy="40" r="9"/>' +
    '<path class="pa" d="M116 82V74Q116 58 130 58T144 74V82Z"/>',
};
