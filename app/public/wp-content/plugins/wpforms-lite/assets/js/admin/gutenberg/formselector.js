/* global wpforms_gutenberg_form_selector, Choices, JSX, DOM */
/* jshint es3: false, esversion: 6 */

/**
 * Gutenberg editor block.
 *
 * @since 1.8.1
 */
const WPForms = window.WPForms || {};

WPForms.FormSelector = WPForms.FormSelector || ( function( document, window, $ ) {
	const { serverSideRender: ServerSideRender = wp.components.ServerSideRender } = wp;
	const { createElement, Fragment, useState, createInterpolateElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { InspectorControls, InspectorAdvancedControls, PanelColorSettings } = wp.blockEditor || wp.editor;
	const { SelectControl, ToggleControl, PanelBody, Placeholder, Flex, FlexBlock, __experimentalUnitControl, TextareaControl, Button, Modal } = wp.components;
	const { strings, defaults, sizes, urls, isPro } = wpforms_gutenberg_form_selector;
	const defaultStyleSettings = defaults;
	const { __ } = wp.i18n;

	/**
	 * List of forms.
	 *
	 * Default value is localized in FormSelector.php.
	 *
	 * @since 1.8.4
	 *
	 * @type {Object}
	 */
	let formList = wpforms_gutenberg_form_selector.forms;

	/**
	 * Blocks runtime data.
	 *
	 * @since 1.8.1
	 *
	 * @type {Object}
	 */
	const blocks = {};

	/**
	 * Whether it is needed to trigger server rendering.
	 *
	 * @since 1.8.1
	 *
	 * @type {boolean}
	 */
	let triggerServerRender = true;

	/**
	 * Popup container.
	 *
	 * @since 1.8.3
	 *
	 * @type {Object}
	 */
	let $popup = {};

	/**
	 * Track fetch status.
	 *
	 * @since 1.8.4
	 *
	 * @type {boolean}
	 */
	let isFetching = false;

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.1
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.1
		 */
		init() {
			app.initDefaults();
			app.registerBlock();

			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.1
		 */
		ready() {
			app.events();
		},

		/**
		 * Events.
		 *
		 * @since 1.8.1
		 */
		events() {
			$( window )
				.on( 'wpformsFormSelectorEdit', _.debounce( app.blockEdit, 250 ) )
				.on( 'wpformsFormSelectorFormLoaded', _.debounce( app.formLoaded, 250 ) );
		},

		/**
		 * Get fresh list of forms via REST-API.
		 *
		 * @since 1.8.4
		 *
		 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
		 */
		async getForms() {
			// If a fetch is already in progress, exit the function.
			if ( isFetching ) {
				return;
			}

			// Set the flag to true indicating a fetch is in progress.
			isFetching = true;

			try {
				// Fetch forms.
				const response = await wp.apiFetch( {
					path: '/wpforms/v1/forms/',
					method: 'GET',
					cache: 'no-cache',
				} );

				// Update the form list.
				formList = response.forms;
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( error );
			} finally {
				isFetching = false;
			}
		},

		/**
		 * Open builder popup.
		 *
		 * @since 1.6.2
		 *
		 * @param {string} clientID Block Client ID.
		 */
		openBuilderPopup( clientID ) {
			if ( $.isEmptyObject( $popup ) ) {
				const tmpl = $( '#wpforms-gutenberg-popup' );
				const parent = $( '#wpwrap' );

				parent.after( tmpl );

				$popup = parent.siblings( '#wpforms-gutenberg-popup' );
			}

			const url = wpforms_gutenberg_form_selector.get_started_url,
				$iframe = $popup.find( 'iframe' );

			app.builderCloseButtonEvent( clientID );
			$iframe.attr( 'src', url );
			$popup.fadeIn();
		},

		/**
		 * Close button (inside the form builder) click event.
		 *
		 * @since 1.8.3
		 *
		 * @param {string} clientID Block Client ID.
		 */
		builderCloseButtonEvent( clientID ) {
			$popup
				.off( 'wpformsBuilderInPopupClose' )
				.on( 'wpformsBuilderInPopupClose', function( e, action, formId, formTitle ) {
					if ( action !== 'saved' || ! formId ) {
						return;
					}

					// Insert a new block when a new form is created from the popup to update the form list and attributes.
					const newBlock = wp.blocks.createBlock( 'wpforms/form-selector', {
						formId: formId.toString(), // Expects string value, make sure we insert string.
					} );

					// eslint-disable-next-line camelcase
					formList = [ { ID: formId, post_title: formTitle } ];

					// Insert a new block.
					wp.data.dispatch( 'core/block-editor' ).removeBlock( clientID );
					wp.data.dispatch( 'core/block-editor' ).insertBlocks( newBlock );
				} );
		},

		/**
		 * Register block.
		 *
		 * @since 1.8.1
		 */
		// eslint-disable-next-line max-lines-per-function
		registerBlock() {
			registerBlockType( 'wpforms/form-selector', {
				title: strings.title,
				description: strings.description,
				icon: app.getIcon(),
				keywords: strings.form_keywords,
				category: 'widgets',
				attributes: app.getBlockAttributes(),
				supports: {
					customClassName: app.hasForms(),
				},
				example: {
					attributes: {
						preview: true,
					},
				},
				edit( props ) {
					// Get fresh list of forms.
					app.getForms();

					const { attributes } = props;
					const formOptions = app.getFormOptions();
					const handlers = app.getSettingsFieldsHandlers( props );

					// Store block clientId in attributes.
					if ( ! attributes.clientId ) {
						// We just want client ID to update once.
						// The block editor doesn't have a fixed block ID, so we need to get it on the initial load, but only once.
						props.setAttributes( { clientId: props.clientId } );
					}

					// Main block settings.
					const jsx = [
						app.jsxParts.getMainSettings( attributes, handlers, formOptions ),
					];

					// Block preview picture.
					if ( ! app.hasForms() ) {
						jsx.push(
							app.jsxParts.getEmptyFormsPreview( props ),
						);

						return jsx;
					}

					const sizeOptions = app.getSizeOptions();

					// Form style settings & block content.
					if ( attributes.formId ) {
						jsx.push(
							app.jsxParts.getStyleSettings( props, handlers, sizeOptions ),
							app.jsxParts.getAdvancedSettings( props, handlers ),
							app.jsxParts.getBlockFormContent( props ),
						);

						handlers.updateCopyPasteContent();

						$( window ).trigger( 'wpformsFormSelectorEdit', [ props ] );

						return jsx;
					}

					// Block preview picture.
					if ( attributes.preview ) {
						jsx.push(
							app.jsxParts.getBlockPreview(),
						);

						return jsx;
					}

					// Block placeholder (form selector).
					jsx.push(
						app.jsxParts.getBlockPlaceholder( props.attributes, handlers, formOptions ),
					);

					return jsx;
				},
				save: () => null,
			} );
		},

		/**
		 * Init default style settings.
		 *
		 * @since 1.8.1
		 */
		initDefaults() {
			[ 'formId', 'copyPasteJsonValue' ].forEach( ( key ) => delete defaultStyleSettings[ key ] );
		},

		/**
		 * Check if site has forms.
		 *
		 * @since 1.8.3
		 *
		 * @return {boolean} Whether site has at least one form.
		 */
		hasForms() {
			return formList.length >= 1;
		},

		/**
		 * Block JSX parts.
		 *
		 * @since 1.8.1
		 *
		 * @type {Object}
		 */
		jsxParts: {

			/**
			 * Get main settings JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} attributes  Block attributes.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} formOptions Form selector options.
			 *
			 * @return {JSX.Element} Main setting JSX code.
			 */
			getMainSettings( attributes, handlers, formOptions ) {
				if ( ! app.hasForms() ) {
					return app.jsxParts.printEmptyFormsNotice( attributes.clientId );
				}

				return (
					<InspectorControls key="wpforms-gutenberg-form-selector-inspector-main-settings">
						<PanelBody className="wpforms-gutenberg-panel" title={ strings.form_settings }>
							<SelectControl
								label={ strings.form_selected }
								value={ attributes.formId }
								options={ formOptions }
								onChange={ ( value ) => handlers.attrChange( 'formId', value ) }
							/>
							{ attributes.formId ? (
								<p className="wpforms-gutenberg-form-selector-actions">
									<a href={ urls.form_url.replace( '{ID}', attributes.formId ) } rel="noreferrer" target="_blank">
										{ strings.form_edit }
									</a>
									{ isPro && (
										<>
											&nbsp;&nbsp;|&nbsp;&nbsp;
											<a href={ urls.entries_url.replace( '{ID}', attributes.formId ) } rel="noreferrer" target="_blank">
												{ strings.form_entries }
											</a>
										</>
									) }
								</p>
							) : null }
							<ToggleControl
								label={ strings.show_title }
								checked={ attributes.displayTitle }
								onChange={ ( value ) => handlers.attrChange( 'displayTitle', value ) }
							/>
							<ToggleControl
								label={ strings.show_description }
								checked={ attributes.displayDesc }
								onChange={ ( value ) => handlers.attrChange( 'displayDesc', value ) }
							/>
							<p className="wpforms-gutenberg-panel-notice">
								<strong>{ strings.panel_notice_head }</strong>
								{ strings.panel_notice_text }
								<a href={ strings.panel_notice_link } rel="noreferrer" target="_blank">{ strings.panel_notice_link_text }</a>
							</p>
						</PanelBody>
					</InspectorControls>
				);
			},

			/**
			 * Print empty forms notice.
			 *
			 * @since 1.8.3
			 *
			 * @param {string} clientId Block client ID.
			 *
			 * @return {JSX.Element} Field styles JSX code.
			 */
			printEmptyFormsNotice( clientId ) {
				return (
					<InspectorControls key="wpforms-gutenberg-form-selector-inspector-main-settings">
						<PanelBody className="wpforms-gutenberg-panel" title={ strings.form_settings }>
							<p className="wpforms-gutenberg-panel-notice wpforms-warning wpforms-empty-form-notice" style={ { display: 'block' } }>
								<strong>{ __( 'You haven’t created a form, yet!', 'wpforms-lite' ) }</strong>
								{ __( 'What are you waiting for?', 'wpforms-lite' ) }
							</p>
							<button type="button" className="get-started-button components-button is-secondary"
								onClick={
									() => {
										app.openBuilderPopup( clientId );
									}
								}
							>
								{ __( 'Get Started', 'wpforms-lite' ) }
							</button>
						</PanelBody>
					</InspectorControls>
				);
			},

			/**
			 * Get Field styles JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props       Block properties.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} sizeOptions Size selector options.
			 *
			 * @return {Object} Field styles JSX code.
			 */
			getFieldStyles( props, handlers, sizeOptions ) { // eslint-disable-line max-lines-per-function
				return (
					<PanelBody className={ app.getPanelClass( props ) } title={ strings.field_styles }>
						<p className="wpforms-gutenberg-panel-notice wpforms-use-modern-notice">
							<strong>{ strings.use_modern_notice_head }</strong>
							{ strings.use_modern_notice_text } <a href={ strings.use_modern_notice_link } rel="noreferrer" target="_blank">{ strings.learn_more }</a>
						</p>

						<p className="wpforms-gutenberg-panel-notice wpforms-warning wpforms-lead-form-notice" style={ { display: 'none' } }>
							<strong>{ strings.lead_forms_panel_notice_head }</strong>
							{ strings.lead_forms_panel_notice_text }
						</p>

						<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
							<FlexBlock>
								<SelectControl
									label={ strings.size }
									value={ props.attributes.fieldSize }
									options={ sizeOptions }
									onChange={ ( value ) => handlers.styleAttrChange( 'fieldSize', value ) }
								/>
							</FlexBlock>
							<FlexBlock>
								<__experimentalUnitControl
									label={ strings.border_radius }
									value={ props.attributes.fieldBorderRadius }
									isUnitSelectTabbable
									onChange={ ( value ) => handlers.styleAttrChange( 'fieldBorderRadius', value ) }
								/>
							</FlexBlock>
						</Flex>

						<div className="wpforms-gutenberg-form-selector-color-picker">
							<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
							<PanelColorSettings
								__experimentalIsRenderedInSidebar
								enableAlpha
								showTitle={ false }
								className="wpforms-gutenberg-form-selector-color-panel"
								colorSettings={ [
									{
										value: props.attributes.fieldBackgroundColor,
										onChange: ( value ) => handlers.styleAttrChange( 'fieldBackgroundColor', value ),
										label: strings.background,
									},
									{
										value: props.attributes.fieldBorderColor,
										onChange: ( value ) => handlers.styleAttrChange( 'fieldBorderColor', value ),
										label: strings.border,
									},
									{
										value: props.attributes.fieldTextColor,
										onChange: ( value ) => handlers.styleAttrChange( 'fieldTextColor', value ),
										label: strings.text,
									},
								] }
							/>
						</div>
					</PanelBody>
				);
			},

			/**
			 * Get Label styles JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props       Block properties.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} sizeOptions Size selector options.
			 *
			 * @return {Object} Label styles JSX code.
			 */
			getLabelStyles( props, handlers, sizeOptions ) {
				return (
					<PanelBody className={ app.getPanelClass( props ) } title={ strings.label_styles }>
						<SelectControl
							label={ strings.size }
							value={ props.attributes.labelSize }
							className="wpforms-gutenberg-form-selector-fix-bottom-margin"
							options={ sizeOptions }
							onChange={ ( value ) => handlers.styleAttrChange( 'labelSize', value ) }
						/>

						<div className="wpforms-gutenberg-form-selector-color-picker">
							<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
							<PanelColorSettings
								__experimentalIsRenderedInSidebar
								enableAlpha
								showTitle={ false }
								className="wpforms-gutenberg-form-selector-color-panel"
								colorSettings={ [
									{
										value: props.attributes.labelColor,
										onChange: ( value ) => handlers.styleAttrChange( 'labelColor', value ),
										label: strings.label,
									},
									{
										value: props.attributes.labelSublabelColor,
										onChange: ( value ) => handlers.styleAttrChange( 'labelSublabelColor', value ),
										label: strings.sublabel_hints.replace( '&amp;', '&' ),
									},
									{
										value: props.attributes.labelErrorColor,
										onChange: ( value ) => handlers.styleAttrChange( 'labelErrorColor', value ),
										label: strings.error_message,
									},
								] }
							/>
						</div>
					</PanelBody>
				);
			},

			/**
			 * Get Button styles JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props       Block properties.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} sizeOptions Size selector options.
			 *
			 * @return {Object}  Button styles JSX code.
			 */
			getButtonStyles( props, handlers, sizeOptions ) {
				return (
					<PanelBody className={ app.getPanelClass( props ) } title={ strings.button_styles }>
						<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
							<FlexBlock>
								<SelectControl
									label={ strings.size }
									value={ props.attributes.buttonSize }
									options={ sizeOptions }
									onChange={ ( value ) => handlers.styleAttrChange( 'buttonSize', value ) }
								/>
							</FlexBlock>
							<FlexBlock>
								<__experimentalUnitControl
									onChange={ ( value ) => handlers.styleAttrChange( 'buttonBorderRadius', value ) }
									label={ strings.border_radius }
									isUnitSelectTabbable
									value={ props.attributes.buttonBorderRadius } />
							</FlexBlock>
						</Flex>

						<div className="wpforms-gutenberg-form-selector-color-picker">
							<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
							<PanelColorSettings
								__experimentalIsRenderedInSidebar
								enableAlpha
								showTitle={ false }
								className="wpforms-gutenberg-form-selector-color-panel"
								colorSettings={ [
									{
										value: props.attributes.buttonBackgroundColor,
										onChange: ( value ) => handlers.styleAttrChange( 'buttonBackgroundColor', value ),
										label: strings.background,
									},
									{
										value: props.attributes.buttonTextColor,
										onChange: ( value ) => handlers.styleAttrChange( 'buttonTextColor', value ),
										label: strings.text,
									},
								] } />
							<div className="wpforms-gutenberg-form-selector-legend wpforms-button-color-notice">
								{ strings.button_color_notice }
							</div>
						</div>
					</PanelBody>
				);
			},

			/**
			 * Get Page Indicator styles JSX code.
			 *
			 * @since 1.8.7
			 *
			 * @param {Object} props    Block properties.
			 * @param {Object} handlers Block event handlers.
			 *
			 * @return {Object} Page Indicator styles JSX code.
			 */
			getPageIndicatorStyles( props, handlers ) {
				if ( ! app.hasPageBreak( formList, props.attributes.formId ) ) {
					return null;
				}

				return (
					<PanelBody className={ app.getPanelClass( props ) } title={ strings.other_styles }>
						<div className="wpforms-gutenberg-form-selector-color-picker">
							<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
							<PanelColorSettings
								__experimentalIsRenderedInSidebar
								enableAlpha
								showTitle={ false }
								className="wpforms-gutenberg-form-selector-color-panel"
								colorSettings={ [
									{
										value: props.attributes.pageBreakColor,
										onChange: ( value ) => handlers.styleAttrChange( 'pageBreakColor', value ),
										label: strings.page_break,
									},
								] } />
						</div>
					</PanelBody>
				);
			},

			/**
			 * Get style settings JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props       Block properties.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} sizeOptions Size selector options.
			 *
			 * @return {Object} Inspector controls JSX code.
			 */
			getStyleSettings( props, handlers, sizeOptions ) {
				return (
					<InspectorControls key="wpforms-gutenberg-form-selector-style-settings">
						{ app.jsxParts.getFieldStyles( props, handlers, sizeOptions ) }
						{ app.jsxParts.getLabelStyles( props, handlers, sizeOptions ) }
						{ app.jsxParts.getButtonStyles( props, handlers, sizeOptions ) }
						{ app.jsxParts.getPageIndicatorStyles( props, handlers ) }
					</InspectorControls>
				);
			},

			/**
			 * Get advanced settings JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props    Block properties.
			 * @param {Object} handlers Block event handlers.
			 *
			 * @return {Object} Inspector advanced controls JSX code.
			 */
			getAdvancedSettings( props, handlers ) {
				// eslint-disable-next-line react-hooks/rules-of-hooks
				const [ isOpen, setOpen ] = useState( false );
				const openModal = () => setOpen( true );
				const closeModal = () => setOpen( false );

				return (
					<InspectorAdvancedControls>
						<div className={ app.getPanelClass( props ) }>
							<TextareaControl
								label={ strings.copy_paste_settings }
								rows="4"
								spellCheck="false"
								value={ props.attributes.copyPasteJsonValue }
								onChange={ ( value ) => handlers.pasteSettings( value ) }
							/>
							<div className="wpforms-gutenberg-form-selector-legend" dangerouslySetInnerHTML={ { __html: strings.copy_paste_notice } }></div>

							<Button className="wpforms-gutenberg-form-selector-reset-button" onClick={ openModal }>{ strings.reset_style_settings }</Button>
						</div>

						{ isOpen && (
							<Modal className="wpforms-gutenberg-modal"
								title={ strings.reset_style_settings }
								onRequestClose={ closeModal }>

								<p>{ strings.reset_settings_confirm_text }</p>

								<Flex gap={ 3 } align="center" justify="flex-end">
									<Button isSecondary onClick={ closeModal }>
										{ strings.btn_no }
									</Button>

									<Button isPrimary onClick={ () => {
										closeModal();
										handlers.resetSettings();
									} }>
										{ strings.btn_yes_reset }
									</Button>
								</Flex>
							</Modal>
						) }
					</InspectorAdvancedControls>
				);
			},

			/**
			 * Get block content JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props Block properties.
			 *
			 * @return {JSX.Element} Block content JSX code.
			 */
			getBlockFormContent( props ) {
				if ( triggerServerRender ) {
					return (
						<ServerSideRender
							key="wpforms-gutenberg-form-selector-server-side-renderer"
							block="wpforms/form-selector"
							attributes={ props.attributes }
						/>
					);
				}

				const clientId = props.clientId;
				const block = app.getBlockContainer( props );

				// In the case of empty content, use server side renderer.
				// This happens when the block is duplicated or converted to a reusable block.
				if ( ! block || ! block.innerHTML ) {
					triggerServerRender = true;

					return app.jsxParts.getBlockFormContent( props );
				}

				blocks[ clientId ] = blocks[ clientId ] || {};
				blocks[ clientId ].blockHTML = block.innerHTML;
				blocks[ clientId ].loadedFormId = props.attributes.formId;

				return (
					<Fragment key="wpforms-gutenberg-form-selector-fragment-form-html">
						<div dangerouslySetInnerHTML={ { __html: blocks[ clientId ].blockHTML } } />
					</Fragment>
				);
			},

			/**
			 * Get block preview JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @return {JSX.Element} Block preview JSX code.
			 */
			getBlockPreview() {
				return (
					<Fragment
						key="wpforms-gutenberg-form-selector-fragment-block-preview">
						<img src={ wpforms_gutenberg_form_selector.block_preview_url } style={ { width: '100%' } } alt="" />
					</Fragment>
				);
			},

			/**
			 * Get block empty JSX code.
			 *
			 * @since 1.8.3
			 *
			 * @param {Object} props Block properties.
			 * @return {JSX.Element} Block empty JSX code.
			 */
			getEmptyFormsPreview( props ) {
				const clientId = props.clientId;

				return (
					<Fragment
						key="wpforms-gutenberg-form-selector-fragment-block-empty">
						<div className="wpforms-no-form-preview">
							<img src={ wpforms_gutenberg_form_selector.block_empty_url } alt="" />
							<p>
								{
									createInterpolateElement(
										__(
											'You can use <b>WPForms</b> to build contact forms, surveys, payment forms, and more with just a few clicks.',
											'wpforms-lite'
										),
										{
											b: <strong />,
										}
									)
								}
							</p>
							<button type="button" className="get-started-button components-button is-primary"
								onClick={
									() => {
										app.openBuilderPopup( clientId );
									}
								}
							>
								{ __( 'Get Started', 'wpforms-lite' ) }
							</button>
							<p className="empty-desc">
								{
									createInterpolateElement(
										__(
											'Need some help? Check out our <a>comprehensive guide.</a>',
											'wpforms-lite'
										),
										{
											// eslint-disable-next-line jsx-a11y/anchor-has-content
											a: <a href={ wpforms_gutenberg_form_selector.wpforms_guide } target="_blank" rel="noopener noreferrer" />,
										}
									)
								}
							</p>

							{ /* Template for popup with builder iframe */ }
							<div id="wpforms-gutenberg-popup" className="wpforms-builder-popup">
								<iframe src="about:blank" width="100%" height="100%" id="wpforms-builder-iframe" title="WPForms Builder Popup"></iframe>
							</div>
						</div>
					</Fragment>
				);
			},

			/**
			 * Get block placeholder (form selector) JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} attributes  Block attributes.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} formOptions Form selector options.
			 *
			 * @return {JSX.Element} Block placeholder JSX code.
			 */
			getBlockPlaceholder( attributes, handlers, formOptions ) {
				return (
					<Placeholder
						key="wpforms-gutenberg-form-selector-wrap"
						className="wpforms-gutenberg-form-selector-wrap">
						<img src={ wpforms_gutenberg_form_selector.logo_url } alt="" />
						<SelectControl
							key="wpforms-gutenberg-form-selector-select-control"
							value={ attributes.formId }
							options={ formOptions }
							onChange={ ( value ) => handlers.attrChange( 'formId', value ) }
						/>
					</Placeholder>
				);
			},
		},

		/**
		 * Determine if the form has a Pagebreak field.
		 *
		 * @since 1.8.7
		 *
		 * @param {Object}        forms  The forms' data object.
		 * @param {number|string} formId Form ID.
		 *
		 * @return {boolean} True when the form has a Pagebreak field, false otherwise.
		 */
		hasPageBreak( forms, formId ) {
			const currentForm = forms.find( ( form ) => parseInt( form.ID, 10 ) === parseInt( formId, 10 ) );

			if ( ! currentForm.post_content ) {
				return false;
			}

			const fields = JSON.parse( currentForm.post_content )?.fields;

			return Object.values( fields ).some( ( field ) => field.type === 'pagebreak' );
		},

		/**
		 * Get Style Settings panel class.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {string} Style Settings panel class.
		 */
		getPanelClass( props ) {
			let cssClass = 'wpforms-gutenberg-panel wpforms-block-settings-' + props.clientId;

			if ( ! app.isFullStylingEnabled() ) {
				cssClass += ' disabled_panel';
			}

			return cssClass;
		},

		/**
		 * Determine whether the full styling is enabled.
		 *
		 * @since 1.8.1
		 *
		 * @return {boolean} Whether the full styling is enabled.
		 */
		isFullStylingEnabled() {
			return wpforms_gutenberg_form_selector.is_modern_markup && wpforms_gutenberg_form_selector.is_full_styling;
		},

		/**
		 * Get block container DOM element.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {Element} Block container.
		 */
		getBlockContainer( props ) {
			const blockSelector = `#block-${ props.clientId } > div`;
			let block = document.querySelector( blockSelector );

			// For FSE / Gutenberg plugin we need to take a look inside the iframe.
			if ( ! block ) {
				const editorCanvas = document.querySelector( 'iframe[name="editor-canvas"]' );

				block = editorCanvas && editorCanvas.contentWindow.document.querySelector( blockSelector );
			}

			return block;
		},

		/**
		 * Get settings fields event handlers.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {Object} Object that contains event handlers for the settings fields.
		 */
		getSettingsFieldsHandlers( props ) { // eslint-disable-line max-lines-per-function
			return {

				/**
				 * Field style attribute change event handler.
				 *
				 * @since 1.8.1
				 *
				 * @param {string} attribute Attribute name.
				 * @param {string} value     New attribute value.
				 */
				styleAttrChange( attribute, value ) {
					const block = app.getBlockContainer( props ),
						container = block.querySelector( `#wpforms-${ props.attributes.formId }` ),
						property = attribute.replace( /[A-Z]/g, ( letter ) => `-${ letter.toLowerCase() }` ),
						setAttr = {};

					if ( container ) {
						switch ( property ) {
							case 'field-size':
							case 'label-size':
							case 'button-size':
								for ( const key in sizes[ property ][ value ] ) {
									container.style.setProperty(
										`--wpforms-${ property }-${ key }`,
										sizes[ property ][ value ][ key ],
									);
								}

								break;

							default:
								container.style.setProperty( `--wpforms-${ property }`, value );
						}
					}

					setAttr[ attribute ] = value;

					props.setAttributes( setAttr );

					triggerServerRender = false;

					this.updateCopyPasteContent();

					$( window ).trigger( 'wpformsFormSelectorStyleAttrChange', [ block, props, attribute, value ] );
				},

				/**
				 * Field regular attribute change event handler.
				 *
				 * @since 1.8.1
				 *
				 * @param {string} attribute Attribute name.
				 * @param {string} value     New attribute value.
				 */
				attrChange( attribute, value ) {
					const setAttr = {};

					setAttr[ attribute ] = value;

					props.setAttributes( setAttr );

					triggerServerRender = true;

					this.updateCopyPasteContent();
				},

				/**
				 * Reset Form Styles settings to defaults.
				 *
				 * @since 1.8.1
				 */
				resetSettings() {
					for ( const key in defaultStyleSettings ) {
						this.styleAttrChange( key, defaultStyleSettings[ key ] );
					}
				},

				/**
				 * Update content of the "Copy/Paste" fields.
				 *
				 * @since 1.8.1
				 */
				updateCopyPasteContent() {
					const content = {};
					const atts = wp.data.select( 'core/block-editor' ).getBlockAttributes( props.clientId );

					for ( const key in defaultStyleSettings ) {
						content[ key ] = atts[ key ];
					}

					props.setAttributes( { copyPasteJsonValue: JSON.stringify( content ) } );
				},

				/**
				 * Paste settings handler.
				 *
				 * @since 1.8.1
				 *
				 * @param {string} value New attribute value.
				 */
				pasteSettings( value ) {
					const pasteAttributes = app.parseValidateJson( value );

					if ( ! pasteAttributes ) {
						wp.data.dispatch( 'core/notices' ).createErrorNotice(
							strings.copy_paste_error,
							{ id: 'wpforms-json-parse-error' }
						);

						this.updateCopyPasteContent();

						return;
					}

					pasteAttributes.copyPasteJsonValue = value;

					props.setAttributes( pasteAttributes );

					triggerServerRender = true;
				},
			};
		},

		/**
		 * Parse and validate JSON string.
		 *
		 * @since 1.8.1
		 *
		 * @param {string} value JSON string.
		 *
		 * @return {boolean|object} Parsed JSON object OR false on error.
		 */
		parseValidateJson( value ) {
			if ( typeof value !== 'string' ) {
				return false;
			}

			let atts;

			try {
				atts = JSON.parse( value );
			} catch ( error ) {
				atts = false;
			}

			return atts;
		},

		/**
		 * Get WPForms icon DOM element.
		 *
		 * @since 1.8.1
		 *
		 * @return {DOM.element} WPForms icon DOM element.
		 */
		getIcon() {
			return createElement(
				'svg',
				{ width: 20, height: 20, viewBox: '0 0 612 612', className: 'dashicon' },
				createElement(
					'path',
					{
						fill: 'currentColor',
						d: 'M544,0H68C30.445,0,0,30.445,0,68v476c0,37.556,30.445,68,68,68h476c37.556,0,68-30.444,68-68V68 C612,30.445,581.556,0,544,0z M464.44,68L387.6,120.02L323.34,68H464.44z M288.66,68l-64.26,52.02L147.56,68H288.66z M544,544H68 V68h22.1l136,92.14l79.9-64.6l79.56,64.6l136-92.14H544V544z M114.24,263.16h95.88v-48.28h-95.88V263.16z M114.24,360.4h95.88 v-48.62h-95.88V360.4z M242.76,360.4h255v-48.62h-255V360.4L242.76,360.4z M242.76,263.16h255v-48.28h-255V263.16L242.76,263.16z M368.22,457.3h129.54V408H368.22V457.3z',
					},
				),
			);
		},

		/**
		 * Get block attributes.
		 *
		 * @since 1.8.1
		 *
		 * @return {Object} Block attributes.
		 */
		getBlockAttributes() { // eslint-disable-line max-lines-per-function
			return {
				clientId: {
					type: 'string',
					default: '',
				},
				formId: {
					type: 'string',
					default: defaults.formId,
				},
				displayTitle: {
					type: 'boolean',
					default: defaults.displayTitle,
				},
				displayDesc: {
					type: 'boolean',
					default: defaults.displayDesc,
				},
				preview: {
					type: 'boolean',
				},
				fieldSize: {
					type: 'string',
					default: defaults.fieldSize,
				},
				fieldBorderRadius: {
					type: 'string',
					default: defaults.fieldBorderRadius,
				},
				fieldBackgroundColor: {
					type: 'string',
					default: defaults.fieldBackgroundColor,
				},
				fieldBorderColor: {
					type: 'string',
					default: defaults.fieldBorderColor,
				},
				fieldTextColor: {
					type: 'string',
					default: defaults.fieldTextColor,
				},
				labelSize: {
					type: 'string',
					default: defaults.labelSize,
				},
				labelColor: {
					type: 'string',
					default: defaults.labelColor,
				},
				labelSublabelColor: {
					type: 'string',
					default: defaults.labelSublabelColor,
				},
				labelErrorColor: {
					type: 'string',
					default: defaults.labelErrorColor,
				},
				buttonSize: {
					type: 'string',
					default: defaults.buttonSize,
				},
				buttonBorderRadius: {
					type: 'string',
					default: defaults.buttonBorderRadius,
				},
				buttonBackgroundColor: {
					type: 'string',
					default: defaults.buttonBackgroundColor,
				},
				buttonTextColor: {
					type: 'string',
					default: defaults.buttonTextColor,
				},
				pageBreakColor: {
					type: 'string',
					default: defaults.pageBreakColor,
				},
				copyPasteJsonValue: {
					type: 'string',
					default: defaults.copyPasteJsonValue,
				},
			};
		},

		/**
		 * Get form selector options.
		 *
		 * @since 1.8.1
		 *
		 * @return {Array} Form options.
		 */
		getFormOptions() {
			const formOptions = formList.map( ( value ) => (
				{ value: value.ID, label: value.post_title }
			) );

			formOptions.unshift( { value: '', label: strings.form_select } );

			return formOptions;
		},

		/**
		 * Get size selector options.
		 *
		 * @since 1.8.1
		 *
		 * @return {Array} Size options.
		 */
		getSizeOptions() {
			return [
				{
					label: strings.small,
					value: 'small',
				},
				{
					label: strings.medium,
					value: 'medium',
				},
				{
					label: strings.large,
					value: 'large',
				},
			];
		},

		/**
		 * Event `wpformsFormSelectorEdit` handler.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e     Event object.
		 * @param {Object} props Block properties.
		 */
		blockEdit( e, props ) {
			const block = app.getBlockContainer( props );

			if ( ! block || ! block.dataset ) {
				return;
			}

			app.initLeadFormSettings( block.parentElement );
		},

		/**
		 * Init Lead Form Settings panels.
		 *
		 * @since 1.8.1
		 *
		 * @param {Element} block Block element.
		 */
		initLeadFormSettings( block ) {
			if ( ! block || ! block.dataset ) {
				return;
			}

			if ( ! app.isFullStylingEnabled() ) {
				return;
			}

			const clientId = block.dataset.block;
			const $form = $( block.querySelector( '.wpforms-container' ) );
			const $panel = $( `.wpforms-block-settings-${ clientId }` );

			if ( $form.hasClass( 'wpforms-lead-forms-container' ) ) {
				$panel
					.addClass( 'disabled_panel' )
					.find( '.wpforms-gutenberg-panel-notice.wpforms-lead-form-notice' )
					.css( 'display', 'block' );

				$panel
					.find( '.wpforms-gutenberg-panel-notice.wpforms-use-modern-notice' )
					.css( 'display', 'none' );

				return;
			}

			$panel
				.removeClass( 'disabled_panel' )
				.find( '.wpforms-gutenberg-panel-notice.wpforms-lead-form-notice' )
				.css( 'display', 'none' );

			$panel
				.find( '.wpforms-gutenberg-panel-notice.wpforms-use-modern-notice' )
				.css( 'display', null );
		},

		/**
		 * Event `wpformsFormSelectorFormLoaded` handler.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e Event object.
		 */
		formLoaded( e ) {
			app.initLeadFormSettings( e.detail.block );
			app.updateAccentColors( e.detail );
			app.loadChoicesJS( e.detail );
			app.initRichTextField( e.detail.formId );

			$( e.detail.block )
				.off( 'click' )
				.on( 'click', app.blockClick );
		},

		/**
		 * Click on the block event handler.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e Event object.
		 */
		blockClick( e ) {
			app.initLeadFormSettings( e.currentTarget );
		},

		/**
		 * Update accent colors of some fields in GB block in Modern Markup mode.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} detail Event details object.
		 */
		updateAccentColors( detail ) {
			if (
				! wpforms_gutenberg_form_selector.is_modern_markup ||
				! window.WPForms ||
				! window.WPForms.FrontendModern ||
				! detail.block
			) {
				return;
			}

			const $form = $( detail.block.querySelector( `#wpforms-${ detail.formId }` ) ),
				FrontendModern = window.WPForms.FrontendModern;

			FrontendModern.updateGBBlockPageIndicatorColor( $form );
			FrontendModern.updateGBBlockIconChoicesColor( $form );
			FrontendModern.updateGBBlockRatingColor( $form );
		},

		/**
		 * Init Modern style Dropdown fields (<select>).
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} detail Event details object.
		 */
		loadChoicesJS( detail ) {
			if ( typeof window.Choices !== 'function' ) {
				return;
			}

			const $form = $( detail.block.querySelector( `#wpforms-${ detail.formId }` ) );

			$form.find( '.choicesjs-select' ).each( function( idx, el ) {
				const $el = $( el );

				if ( $el.data( 'choice' ) === 'active' ) {
					return;
				}

				const args = window.wpforms_choicesjs_config || {},
					searchEnabled = $el.data( 'search-enabled' ),
					$field = $el.closest( '.wpforms-field' );

				args.searchEnabled = 'undefined' !== typeof searchEnabled ? searchEnabled : true;
				args.callbackOnInit = function() {
					const self = this,
						$element = $( self.passedElement.element ),
						$input = $( self.input.element ),
						sizeClass = $element.data( 'size-class' );

					// Add CSS-class for size.
					if ( sizeClass ) {
						$( self.containerOuter.element ).addClass( sizeClass );
					}

					/**
					 * If a multiple select has selected choices - hide a placeholder text.
					 * In case if select is empty - we return placeholder text back.
					 */
					if ( $element.prop( 'multiple' ) ) {
						// On init event.
						$input.data( 'placeholder', $input.attr( 'placeholder' ) );

						if ( self.getValue( true ).length ) {
							$input.removeAttr( 'placeholder' );
						}
					}

					this.disable();
					$field.find( '.is-disabled' ).removeClass( 'is-disabled' );
				};

				try {
					const choicesInstance = new Choices( el, args );

					// Save Choices.js instance for future access.
					$el.data( 'choicesjs', choicesInstance );
				} catch ( e ) {} // eslint-disable-line no-empty
			} );
		},

		/**
		 * Initialize RichText field.
		 *
		 * @since 1.8.1
		 *
		 * @param {number} formId Form ID.
		 */
		initRichTextField( formId ) {
			// Set default tab to `Visual`.
			$( `#wpforms-${ formId } .wp-editor-wrap` ).removeClass( 'html-active' ).addClass( 'tmce-active' );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPForms.FormSelector.init();
