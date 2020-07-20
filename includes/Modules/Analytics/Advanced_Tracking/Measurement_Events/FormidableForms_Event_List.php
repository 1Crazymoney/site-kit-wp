<?php
/**
 * Class Google\Site_Kit\Modules\Analytics\Advanced_Tracking\Measurement_Events\FormidableForms_Event_List
 *
 * @package   Google\Site_Kit
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\Analytics\Advanced_Tracking\Measurement_Events;

/**
 * Class for containing tracking event information for Formidable Forms plugin.
 *
 * @since n.e.x.t.
 * @access ignore
 * @ignore
 */
final class FormidableForms_Event_List extends Measurement_Event_List {

	/**
	 * FormidableForms_Event_List constructor.
	 *
	 * @since n.e.x.t.
	 */
	public function __construct() {
		$event = new Measurement_Event(
			array(
				'pluginName' => 'Formidable Forms',
				'category'   => 'engagement',
				'action'     => 'form_submit',
				'selector'   => '.frm_fields_container .frm_button_submit',
				'on'         => 'click',
				'metadata'   => <<<CALLBACK
function( params, element ) {
	var formId = element.closest('.frm_fields_container').querySelector('input[name="form_id"]').value;
	console.log(formId);
	params['event_label'] = formId;
	return params;
}
CALLBACK
			,
			)
		);
		$this->add_event( $event );
	}
}
