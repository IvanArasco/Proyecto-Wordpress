/**
 * Internal dependencies
 */
import Testimonial from './testimonial';

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

export default function Save( props ) {
	const {
		testimonialName,
		testimonialTitle,
		testimonialContent,
		testimonialAlignment,
		testimonialImgURL,
		testimonialImgAlt,
		testimonialTextColor,
	} = props.attributes;

	return (
		<Testimonial { ...props }>
			<RichText.Content
				tagName="div"
				className="gb-testimonial-text"
				style={ {
					textAlign: testimonialAlignment,
				} }
				value={ testimonialContent }
			/>
			<div className="gb-testimonial-info">
				{ testimonialImgURL && (
					<div className="gb-testimonial-avatar-wrap">
						<div className="gb-testimonial-image-wrap">
							<img
								className="gb-testimonial-avatar"
								src={ testimonialImgURL }
								alt={
									testimonialImgAlt ? testimonialImgAlt : null
								}
							/>
						</div>
					</div>
				) }
				<RichText.Content
					tagName="h2"
					className="gb-testimonial-name"
					style={ {
						color: testimonialTextColor
							? testimonialTextColor
							: '#32373c',
					} }
					value={ testimonialName }
				/>
				<RichText.Content
					tagName="small"
					className="gb-testimonial-title"
					style={ {
						color: testimonialTextColor
							? testimonialTextColor
							: '#32373c',
					} }
					value={ testimonialTitle }
				/>
			</div>
		</Testimonial>
	);
}
