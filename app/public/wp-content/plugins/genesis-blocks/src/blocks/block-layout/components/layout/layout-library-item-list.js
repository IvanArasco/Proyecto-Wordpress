/**
 * Layout Library Card Item.
 */

/**
 * Dependencies.
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { addQueryArgs } = wp.url;
const { Component, Fragment } = wp.element;

export default class LayoutLibraryItemList extends Component {
	render() {
		const postIdString = this.props.itemKey.match( /\d+/g );
		const postID = postIdString[ 0 ];

		return (
			<Fragment>
				<div className="gb-layout-reusable">
					<div>
						{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */ }
						<a
							role="button"
							key={ this.props.itemKey }
							className="gb-layout-insert-button"
							onClick={ () => {
								this.props.import( this.props.content );
							} }
						>
							{ this.props.name }
						</a>
					</div>
					<div className="gb-layout-reusable-actions">
						<span>
							<a
								href={ addQueryArgs( 'post.php', {
									post: postID,
									post_type: 'wp_block',
									action: 'edit',
								} ) }
								target="_blank"
								rel="noopener noreferrer"
							>
								{ __( 'Edit', 'genesis-blocks' ) }
							</a>
						</span>
					</div>
				</div>
			</Fragment>
		);
	}
}
