import { RichText } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import DismissButton from '../components/button';
import icons from '../components/icons';
import NoticeBox from '../components/notice'
import migrate from './migrate';

const v1 = {
	attributes: {
		noticeTitle: {
			type: 'string',
			selector: '.gb-notice-title',
		},
		noticeContent: {
			type: 'array',
			selector: '.gb-notice-text',
			source: 'children',
		},
		noticeAlignment: {
			type: 'string',
		},
		noticeBackgroundColor: {
			type: 'string',
			default: '#00d1b2',
		},
		noticeTextColor: {
			type: 'string',
			default: '#32373c',
		},
		noticeTitleColor: {
			type: 'string',
			default: '#fff',
		},
		noticeFontSize: {
			type: 'number',
			default: 18,
		},
		noticeDismiss: {
			type: 'string',
			default: '',
		},
	},
	save( props ) {
		const {
			noticeTitle,
			noticeContent,
			noticeBackgroundColor,
			noticeTitleColor,
			noticeDismiss,
		} = props.attributes;

		return (
			<NoticeBox { ...props }>
				{ noticeDismiss && 'gb-dismissable' === noticeDismiss && (
					<DismissButton { ...props }>
						{ icons.dismiss }
					</DismissButton>
				) }
				{ noticeTitle && (
					<div
						className="gb-notice-title"
						style={ {
							color: noticeTitleColor,
						} }
					>
						<RichText.Content tagName="p" value={ noticeTitle } />
					</div>
				) }
				{ noticeContent && (
					<RichText.Content
						tagName="div"
						className="gb-notice-text"
						style={ {
							borderColor: noticeBackgroundColor,
						} }
						value={ noticeContent }
					/>
				) }
			</NoticeBox>
		);
	},
	migrate: ( attributes ) => migrate( attributes, createBlock ),
};

export default [ v1 ];
