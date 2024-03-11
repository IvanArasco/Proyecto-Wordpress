/**
 * Component deprecations.
 */

import Accordion_3_0_save from './3.0/components/save';
import migrate_3_0 from './3.0/utils/migrate';
import Accordion_2_0_save from './2.0/components/save';

export const Accordion_3_0_attributes = {
	accordionTitle: {
		type: 'array',
		selector: '.gb-accordion-title',
		source: 'children',
	},
	accordionText: {
		type: 'array',
		selector: '.gb-accordion-text',
		source: 'children',
	},
	accordionAlignment: {
		type: 'string',
	},
	accordionFontSize: {
		type: 'number',
		default: undefined,
	},
	accordionOpen: {
		type: 'boolean',
		default: false,
	},
};

export const Accordion_2_0_attributes = {
	accordionTitle: {
		type: 'array',
		selector: '.gb-accordion-title',
		source: 'children',
	},
	accordionText: {
		type: 'array',
		selector: '.gb-accordion-text',
		source: 'children',
	},
	accordionAlignment: {
		type: 'string',
	},
	accordionFontSize: {
		type: 'number',
		default: 18,
	},
	accordionOpen: {
		type: 'boolean',
		default: false,
	},
};

const Deprecated = [
	/* Version 3.0. */
	{
		attributes: Accordion_3_0_attributes,
		save: Accordion_3_0_save,
		migrate: migrate_3_0,
	},
	/* Version 2.0. */
	{
		attributes: Accordion_2_0_attributes,
		save: Accordion_2_0_save,
	},
];

export default Deprecated;
