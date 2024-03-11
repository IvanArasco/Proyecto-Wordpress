/**
 * WordPress depenencies
 */
const { InspectorControls, LineHeightControl } = wp.blockEditor;
const { hasBlockSupport } = wp.blocks;
const { Button, FontSizePicker, NavigableMenu, PanelBody } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { useDispatch, useSelect } = wp.data;
const { __ } = wp.i18n;
import { cleanEmptyObject } from '../utils';

/**
 * Internal dependencies
 */
import { ResponsiveSettingStyle } from './responsive-settings-style';
import {
	BLOCKS_WITH_RESPONSIVE_SETTINGS,
	DEVICE_NAMES,
	DEVICE_SIZES,
	RESPONSIVE_SETTINGS_ATTRIBUTE,
} from '../constants';
import { conditionallyAddPxUnit, getFontSize, getFontSlug } from '../utils';

export const withResponsiveSettings = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const {
				disableCustomFontSizes,
				enableCustomLineHeight,
				fontSizes,
			} = useSelect( ( select ) =>
				select( 'core/block-editor' ).getSettings()
			);
			const selectedDevice = useSelect( ( select ) => {
				const device =
					select(
						'core/edit-post'
					)?.__experimentalGetPreviewDeviceType;
				return !! device ? device() : DEVICE_NAMES.desktop;
			} );

			const setDevice =
				useDispatch(
					'core/edit-post'
				)?.__experimentalSetPreviewDeviceType;
			const isFontSizeDisabled =
				! hasBlockSupport( props.name, 'typography.fontSize', true ) ||
				! fontSizes?.length;
			const isLineHeightDisabled =
				! hasBlockSupport(
					props.name,
					'typography.lineHeight',
					true
				) || ! enableCustomLineHeight;

			if (
				! BLOCKS_WITH_RESPONSIVE_SETTINGS.includes( props.name ) ||
				( isFontSizeDisabled && isLineHeightDisabled )
			) {
				return <BlockEdit { ...props } />;
			}

			/**
			 * Sets the preview device, if the function to set it exists.
			 *
			 * @param { 'Mobile' | 'Tablet' | 'Desktop' } device The device to set the preview to.
			 */
			const setSelectedDevice = ( device ) => {
				if ( !! setDevice ) {
					setDevice( device );
				}
			};

			/**
			 * Gets the responsive value for the device.
			 *
			 * @param { 'fontSize' | 'lineHeight' } responsiveSettingName The key of the responsive value.
			 * @param {string}                      device                The device The device to get the responsive value for.
			 * @return {string} The responsive value.
			 */
			const getResponsiveValueForDevice = (
				responsiveSettingName,
				device
			) =>
				props.attributes[ RESPONSIVE_SETTINGS_ATTRIBUTE ] &&
				props.attributes[ RESPONSIVE_SETTINGS_ATTRIBUTE ][ device ]
					? props.attributes[ RESPONSIVE_SETTINGS_ATTRIBUTE ][
							device
					  ][ responsiveSettingName ]
					: '';

			/**
			 * Gets the font size of the selected device.
			 *
			 * @return {string} The font size in px, em or rem, if any.
			 */
			const getFontSizeOfSelectedDevice = () => {
				if ( DEVICE_NAMES.desktop === selectedDevice ) {
					return (
						getFontSize( props.attributes.fontSize, fontSizes ) ||
						getFontSize(
							props.attributes?.style?.typography?.fontSize,
							fontSizes
						) ||
						props.attributes?.style?.typography?.fontSize
					);
				}

				const responsiveValue = getResponsiveValueForDevice(
					'fontSize',
					DEVICE_SIZES[ selectedDevice ]
				);

				return (
					getFontSize( responsiveValue, fontSizes ) || responsiveValue
				);
			};

			/**
			 * Gets the line height of the selected device.
			 *
			 * @return {string} The line height.
			 */
			const getLineHeightOfSelectedDevice = () =>
				DEVICE_NAMES.desktop === selectedDevice
					? props.attributes?.style?.typography?.lineHeight
					: getResponsiveValueForDevice(
							'lineHeight',
							DEVICE_SIZES[ selectedDevice ]
					  );

			/**
			 * Sets the responsive value, like a 'lineHeight' of '2.0'.
			 *
			 * @param {string} key   The key of the responsive value to set.
			 * @param {string} value The responsive value to set.
			 */
			const setResponsiveValue = ( key, value ) => {
				props.setAttributes( {
					[ RESPONSIVE_SETTINGS_ATTRIBUTE ]: {
						...props.attributes[ RESPONSIVE_SETTINGS_ATTRIBUTE ],
						[ DEVICE_SIZES[ selectedDevice ] ]: {
							...props.attributes[
								RESPONSIVE_SETTINGS_ATTRIBUTE
							][ DEVICE_SIZES[ selectedDevice ] ],
							[ key ]: value,
						},
					},
				} );
			};

			const mobileFont = getResponsiveValueForDevice(
				'fontSize',
				DEVICE_SIZES.Mobile
			);
			const tabletFont = getResponsiveValueForDevice(
				'fontSize',
				DEVICE_SIZES.Tablet
			);

			return (
				<>
					{ Object.keys(
						props.attributes[ RESPONSIVE_SETTINGS_ATTRIBUTE ]
					).length ? (
						<style>
							{ isFontSizeDisabled ? null : (
								<>
									<ResponsiveSettingStyle
										device={ DEVICE_SIZES.Tablet }
										selectedDevice={
											DEVICE_SIZES[ selectedDevice ]
										}
										settingName="fontSize"
										settingValue={ conditionallyAddPxUnit(
											getFontSize(
												tabletFont,
												fontSizes
											) || tabletFont
										) }
										clientId={ props.clientId }
									/>
									<ResponsiveSettingStyle
										device={ DEVICE_SIZES.Mobile }
										selectedDevice={
											DEVICE_SIZES[ selectedDevice ]
										}
										settingName="fontSize"
										settingValue={ conditionallyAddPxUnit(
											getFontSize(
												mobileFont,
												fontSizes
											) || mobileFont
										) }
										clientId={ props.clientId }
									/>
								</>
							) }
							{ isLineHeightDisabled ? null : (
								<>
									<ResponsiveSettingStyle
										device={ DEVICE_SIZES.Tablet }
										selectedDevice={
											DEVICE_SIZES[ selectedDevice ]
										}
										settingName="lineHeight"
										settingValue={ getResponsiveValueForDevice(
											'lineHeight',
											DEVICE_SIZES.Tablet
										) }
										clientId={ props.clientId }
									/>
									<ResponsiveSettingStyle
										device={ DEVICE_SIZES.Mobile }
										selectedDevice={
											DEVICE_SIZES[ selectedDevice ]
										}
										settingName="lineHeight"
										settingValue={ getResponsiveValueForDevice(
											'lineHeight',
											DEVICE_SIZES.Mobile
										) }
										clientId={ props.clientId }
									/>
								</>
							) }
						</style>
					) : null }
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __(
								'Responsive Typography',
								'genesis-blocks'
							) }
						>
							<NavigableMenu
								className="gb-responsive-toggle"
								onNavigate={ () => {} }
								orientation="horizontal"
							>
								<Button
									icon="laptop"
									showTooltip
									label={ __(
										'Desktop view',
										'genesis-blocks'
									) }
									onClick={ () =>
										setSelectedDevice(
											DEVICE_NAMES.desktop
										)
									}
									isPrimary={
										DEVICE_NAMES.desktop === selectedDevice
									}
									isSecondary={
										DEVICE_NAMES.desktop !== selectedDevice
									}
								>
									{ __( 'Desktop', 'genesis-blocks' ) }
								</Button>
								<Button
									icon="tablet"
									showTooltip
									label={ __(
										'Tablet view',
										'genesis-blocks'
									) }
									onClick={ () =>
										setSelectedDevice( DEVICE_NAMES.tablet )
									}
									isPrimary={
										DEVICE_NAMES.tablet === selectedDevice
									}
									isSecondary={
										DEVICE_NAMES.tablet !== selectedDevice
									}
								>
									{ __( 'Tablet', 'genesis-blocks' ) }
								</Button>
								<Button
									icon="smartphone"
									showTooltip
									label={ __(
										'Mobile view',
										'genesis-blocks'
									) }
									onClick={ () =>
										setSelectedDevice( DEVICE_NAMES.mobile )
									}
									isPrimary={
										DEVICE_NAMES.mobile === selectedDevice
									}
									isSecondary={
										DEVICE_NAMES.mobile !== selectedDevice
									}
								>
									{ __( 'Mobile', 'genesis-blocks' ) }
								</Button>
							</NavigableMenu>
							{ isFontSizeDisabled ? null : (
								<FontSizePicker
									value={ getFontSizeOfSelectedDevice() }
									onChange={ ( newFontSize ) => {
										const fontSizeSlug = getFontSlug(
											newFontSize,
											fontSizes
										);

										if (
											DEVICE_NAMES.desktop ===
											selectedDevice
										) {
											props.setAttributes( {
												style: cleanEmptyObject( {
													...props.attributes?.style,
													typography: {
														...props.attributes
															?.style?.typography,
														fontSize: fontSizeSlug
															? undefined
															: newFontSize,
													},
												} ),
												fontSize: fontSizeSlug,
											} );

											return;
										}

										setResponsiveValue(
											'fontSize',
											fontSizeSlug || newFontSize
										);
									} }
									fontSizes={ fontSizes }
									disableCustomFontSizes={
										disableCustomFontSizes
									}
									__nextHasNoMarginBottom
								/>
							) }
							{ isLineHeightDisabled ||
							! LineHeightControl ? null : (
								<LineHeightControl
									__nextHasNoMarginBottom={ true }
									value={ getLineHeightOfSelectedDevice() }
									onChange={ ( newLineHeight ) => {
										if (
											DEVICE_NAMES.desktop ===
											selectedDevice
										) {
											props.setAttributes( {
												style: {
													...props.attributes?.style,
													typography: {
														...props.attributes
															?.style?.typography,
														lineHeight:
															newLineHeight,
													},
												},
											} );

											return;
										}

										setResponsiveValue(
											'lineHeight',
											newLineHeight
										);
									} }
								/>
							) }
						</PanelBody>
					</InspectorControls>
				</>
			);
		};
	},
	'withResponsiveSettings'
);
