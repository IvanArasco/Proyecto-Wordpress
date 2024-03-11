import migrate from './utils/migrate';
import save from './components/save';

const v1 = {
	attributes: {
		testimonialName: {
			type: 'array',
			selector: '.gb-testimonial-name',
			source: 'children',
		},
		testimonialTitle: {
			type: 'array',
			selector: '.gb-testimonial-title',
			source: 'children',
		},
		testimonialContent: {
			type: 'array',
			selector: '.gb-testimonial-text',
			source: 'children',
		},
		testimonialAlignment: {
			type: 'string',
		},
		testimonialImgURL: {
			type: 'string',
			source: 'attribute',
			attribute: 'src',
			selector: 'img',
		},
		testimonialImgID: {
			type: 'number',
		},
		testimonialImgAlt: {
			type: 'string',
			source: 'attribute',
			attribute: 'alt',
			selector: 'img',
		},
		testimonialBackgroundColor: {
			type: 'string',
			default: '#f2f2f2',
		},
		testimonialTextColor: {
			type: 'string',
			default: '#32373c',
		},
		testimonialFontSize: {
			type: 'number',
			default: 18,
		},
		testimonialCiteAlign: {
			type: 'string',
			default: 'left-aligned',
		},
	},
	migrate,
	save,
};

export default [ v1 ];
