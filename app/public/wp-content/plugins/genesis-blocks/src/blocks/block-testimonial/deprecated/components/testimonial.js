import classnames from 'classnames';

export default function Testimonial( {
	attributes: {
		testimonialImgURL,
		testimonialBackgroundColor,
		testimonialTextColor,
		testimonialFontSize,
		testimonialCiteAlign,
	},
	children,
	className,
} ) {
	return (
		<div
			style={ {
				backgroundColor: testimonialBackgroundColor
					? testimonialBackgroundColor
					: '#f2f2f2',
				color: testimonialTextColor
					? testimonialTextColor
					: '#32373c',
			} }
			className={ classnames(
				className,
				testimonialCiteAlign,
				{ 'gb-has-avatar': testimonialImgURL },
				'gb-font-size-' + testimonialFontSize,
				'gb-block-testimonial'
			) }
		>
			{ children }
		</div>
	);
}
